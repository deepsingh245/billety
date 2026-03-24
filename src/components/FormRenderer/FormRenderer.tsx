import React, { forwardRef, useImperativeHandle, useEffect, useMemo, useCallback, FormEvent } from 'react';
import { Controller } from 'react-hook-form';
import { useFormEngine } from "./FormEngine";
import { useTheme, Box } from "@mui/material";
import { FieldComponents } from "./FieldComponents";
import { LayoutRenderer } from "./LayoutRenderer";
import { GroupRenderer } from "./GroupRenderer";
import { StepRenderer } from "./StepRenderer";
import { SubmitButton } from "./SubmitButton";

// Base interfaces mirroring the JSON config parameters dynamically
export interface FieldConfig {
  id: string;
  type: string;
  label?: React.ReactNode | string;
  labelPosition?: 'top' | 'left' | 'right' | 'floating' | 'none';
  placeholder?: string;
  hint?: string;
  tooltip?: string | any;
  prefix?: React.ReactNode | string;
  suffix?: React.ReactNode | string;
  required?: boolean;
  disabled?: boolean | ((state: any) => boolean);
  readOnly?: boolean | ((state: any) => boolean);
  hidden?: boolean | ((state: any) => boolean);
  visible?: boolean | ((state: any) => boolean);
  defaultValue?: any;
  value?: any | ((state: any) => any);
  width?: 'full' | 'half' | 'third' | 'auto' | string;
  colSpan?: number;
  order?: number;
  group?: string;
  step?: string;
  validation?: any;
  onChange?: (val: any) => void;
  onBlur?: (e: any) => void;
  onFocus?: (e: any) => void;
  transform?: (val: any) => any;
  display?: (val: any) => string;
  render?: React.ElementType;
  wrapperRender?: React.ElementType;
  errorRender?: React.ElementType;
  labelRender?: React.ElementType;
  props?: Record<string, any>;
  className?: string;
  style?: React.CSSProperties;
  dataAttributes?: Record<string, string>;
  aria?: any;
  testId?: string;
  copyable?: boolean;
  clearable?: boolean;
  loading?: boolean | ((state: any) => boolean);
  conditions?: any[];
  dependencies?: string[];
  meta?: Record<string, any>;
}

export interface GroupConfig {
  id: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  columns?: number;
  visible?: boolean | ((state: any) => boolean);
  render?: React.ElementType;
  headerRender?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export interface StepConfig {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  fields?: string[];
  groups?: string[];
}

export interface LayoutConfig {
  type?: 'flat' | 'grid' | 'steps' | 'tabs' | 'accordion';
  columns?: number;
  gap?: string | number;
  fieldWidth?: 'full' | 'half' | 'auto';
  sectionGap?: string | number;
  padding?: string | number;
  maxWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  responsive?: any;
}

export interface SubmitConfig {
  label: string;
  loadingLabel?: string;
  successLabel?: string;
  position?: 'left' | 'right' | 'center' | 'full';
  render?: React.ElementType;
  onSubmit: (values: any) => void | Promise<void>;
  transform?: (values: any) => any;
}

export interface MetaConfig {
  title?: string;
  subtitle?: string;
  icon?: string;
  badge?: string;
  headerRender?: React.ElementType;
  footerRender?: React.ElementType;
}

export interface FormConfig {
  id: string;
  version?: string;
  meta?: MetaConfig;
  layout?: LayoutConfig;
  fields?: FieldConfig[];
  groups?: GroupConfig[];
  steps?: StepConfig[];
  validation?: {
    mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'all';
    schema?: any;
  };
  submit: SubmitConfig;
  theme?: any;
  hooks?: any;
  i18n?: any;
  defaultValues?: Record<string, any>;
  resetOnSubmit?: boolean;
  persistKey?: string;
}

export interface FormApi {
  submit: () => void;
  reset: () => void;
  getValues: () => Record<string, any>;
  setValue: (field: string, value: any) => void;
  validate: () => Promise<boolean>;
}

export interface FormRendererProps {
  config: FormConfig;
}

export const FormRenderer = forwardRef<FormApi, FormRendererProps>(({ config }, ref) => {
  const theme = useTheme();
  
  const engine = useFormEngine({
    config,
    defaultValues: config.defaultValues,
    validationMode: config.validation?.mode || 'onSubmit',
    persistKey: config.persistKey
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    isSubmitSuccessful,
    handleChange,
    handleBlur,
    handleFocus,
    handleSubmit,
    evaluateConditions,
    resetForm,
    setFieldValue,
    validateForm,
    getFieldState
  } = engine;

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    reset: resetForm,
    getValues: () => values,
    setValue: setFieldValue,
    validate: validateForm,
  }), [handleSubmit, resetForm, values, setFieldValue, validateForm]);

  useEffect(() => {
    evaluateConditions();
  }, [values, evaluateConditions]);

  const internalOnSubmit = useCallback(async (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;

    let payload = { ...values };
    if (config.submit?.transform) {
      payload = config.submit.transform(payload);
    }

    try {
      await config.submit.onSubmit(payload);
      if (config.resetOnSubmit) {
        resetForm();
      }
    } catch (err) {
      console.error('Form submission failed', err);
    }
  }, [validateForm, values, config, resetForm]);

  const renderField = useCallback((field: FieldConfig) => {
    const fieldState = getFieldState?.(field.id) || {
      visible: field.visible !== false,
      disabled: field.disabled === true,
      readOnly: field.readOnly === true,
      required: field.required === true
    };

    if (!fieldState.visible) return null;

    let Component = FieldComponents[field.type as keyof typeof FieldComponents] as any;
    
    if (field.render) {
      Component = field.render as any;
    }

    if (!Component) {
      console.warn(`No component found for field type: ${field.type}`);
      return null;
    }

    const hasError = touched[field.id] && !!errors[field.id];
    const errorMessage = hasError ? errors[field.id] : undefined;

    const rules: any = { required: fieldState.required ? 'This field is required' : false };
    if (field.validation) {
      Object.assign(rules, field.validation);
    }

    let fieldContent = (
      <Controller
        name={field.id}
        control={engine.control}
        rules={rules}
        defaultValue={field.defaultValue ?? ''}
        render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
          <Component
            key={field.id}
            {...field.props}
            id={field.id}
            name={field.id}
            label={field.label}
            value={value}
            onChange={(val: any) => {
              onChange(val);
              field.onChange?.(val);
            }}
            onBlur={(e: any) => {
              onBlur();
              handleBlur(field.id);
              field.onBlur?.(e);
            }}
            onFocus={(e: any) => {
              handleFocus(field.id);
              field.onFocus?.(e);
            }}
            disabled={fieldState.disabled}
            readOnly={fieldState.readOnly}
            required={fieldState.required}
            placeholder={field.placeholder}
            error={error?.message || errorMessage}
            className={field.className}
            style={{
              ...field.style,
              borderRadius: theme.shape.borderRadius,
              gridColumn: field.colSpan ? `span ${field.colSpan}` : undefined,
            }}
            data-testid={field.testId}
            inputRef={ref}
            {...field.aria}
            {...field.dataAttributes}
          />
        )}
      />
    );

    if (field.wrapperRender) {
      const Wrapper = field.wrapperRender;
      fieldContent = (
        <Wrapper key={`${field.id}-wrapper`} field={field} state={fieldState} error={errorMessage}>
          {fieldContent}
        </Wrapper>
      );
    } else if (field.labelRender || field.errorRender) {
      const LabelComp = field.labelRender;
      const ErrorComp = field.errorRender;
      fieldContent = (
        <div key={`${field.id}-container`} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing?.(1) }}>
          {LabelComp && <LabelComp field={field} required={fieldState.required} />}
          {fieldContent}
          {ErrorComp && hasError && <ErrorComp error={errorMessage} />}
        </div>
      );
    }

    return fieldContent;
  }, [getFieldState, values, touched, errors, handleChange, handleBlur, handleFocus, theme]);

  const renderLayout = useMemo(() => {
    const layoutType = config.layout?.type || 'flat';
    
    if (layoutType === 'steps' && config.steps) {
      return (
        <StepRenderer 
          steps={config.steps} 
          config={config} 
          renderField={renderField} 
          engine={engine} 
        />
      );
    }
    
    if (config.groups && config.groups.length > 0) {
      return (
        <GroupRenderer 
          groups={config.groups} 
          config={config} 
          renderField={renderField} 
          engine={engine} 
        />
      );
    }
    
    return (
      <LayoutRenderer layout={config.layout} theme={theme}>
        {config.fields?.map(field => renderField(field))}
      </LayoutRenderer>
    );
  }, [config, renderField, engine, theme]);

  const Header = config.meta?.headerRender;
  const Footer = config.meta?.footerRender;
  const SubmitComponent = config.submit?.render || SubmitButton;

  return (
    <Box 
      className="form-renderer"
      sx={{
        maxWidth: config.layout?.maxWidth || '100%',
        p: config.layout?.padding || 0,
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      {Header && <Header meta={config.meta} />}
      
      <form onSubmit={internalOnSubmit} noValidate>
        {renderLayout}
        
        {config.submit && (
          <Box
            sx={{
              mt: config.layout?.sectionGap || 4,
              display: 'flex',
              justifyContent: 
                config.submit.position === 'center' ? 'center' : 
                config.submit.position === 'right' ? 'flex-end' : 
                config.submit.position === 'full' ? 'stretch' : 'flex-start',
              width: '100%'
            }}
          >
            <SubmitComponent 
              label={isSubmitSuccessful && config.submit.successLabel ? config.submit.successLabel : config.submit.label}
              loadingLabel={config.submit.loadingLabel}
              isLoading={isSubmitting}
              isSuccess={isSubmitSuccessful}
              fullWidth={config.submit.position === 'full'}
              sx={{ borderRadius: theme.shape.borderRadius }}
            />
          </Box>
        )}
      </form>
      
      {Footer && <Footer meta={config.meta} />}
    </Box>
  );
});

FormRenderer.displayName = 'FormRenderer';

export default FormRenderer;
