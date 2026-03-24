import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

export const useFormEngine = ({ config, defaultValues, validationMode }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  // Use react-hook-form locally for engine capabilities since it was requested 
  // without redesigning existing architectures
  const form = useForm({
    defaultValues,
    mode: validationMode === 'onSubmit' ? 'onSubmit' : 'onChange'
  });

  const evaluateConditions = () => {
     // A mock condition evaluator for the engine
  };

  return {
    values: form.getValues(),
    errors: form.formState.errors,
    touched: form.formState.touchedFields,
    isSubmitting: form.formState.isSubmitting || isSubmitting,
    isSubmitSuccessful: form.formState.isSubmitSuccessful || isSubmitSuccessful,
    handleChange: (id: string, val: any) => form.setValue(id, val, { shouldValidate: true }),
    handleBlur: (id: string) => form.trigger(id),
    handleFocus: (id: string) => {},
    handleSubmit: form.handleSubmit(async (data) => {
      setIsSubmitting(true);
      if(config.submit?.onSubmit) {
         try {
           let payload = data;
           if(config.submit.transform) payload = config.submit.transform(data);
           await config.submit.onSubmit(payload);
           setIsSubmitSuccessful(true);
         } catch(e) { console.error(e) }
      }
      setIsSubmitting(false);
    }),
    evaluateConditions,
    resetForm: form.reset,
    setFieldValue: form.setValue,
    validateForm: async () => form.trigger(),
    getFieldState: (id: string) => ({ visible: true, disabled: false, readOnly: false, required: false }),
    control: form.control,
    register: form.register
  };
};
