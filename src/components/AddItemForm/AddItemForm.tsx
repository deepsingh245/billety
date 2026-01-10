import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import {
  FormLabel,
  OutlinedInput,
  FormHelperText,
  Button,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { Item } from "../../interfaces/item.interface";
import { createDocument } from "../../firebase/firebaseUtils";
import { GlobalUIService } from "../../utils/GlobalUIService";
import { APP_CONSTANTS } from "../../constants/app.constants";

interface AddItemFormProps {
  onSuccess?: () => void;
}

export default function AddItemForm({ onSuccess }: AddItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Item>();

  const onSubmit = async (data: Item) => {
    GlobalUIService.setLoading(true);
    try {
      await createDocument(APP_CONSTANTS.COLLECTIONS.ITEMS, data);
      GlobalUIService.setLoading(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error adding item:", error);
      GlobalUIService.setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth error={!!errors.name}>
            <FormLabel required sx={{ color: 'text.secondary', mb: 1 }}>Name</FormLabel>
            <OutlinedInput
              size="small"
              placeholder="Item Name"
              {...register("name", { required: "Name is required" })}
              sx={{ bgcolor: 'background.paper' }}
            />
            {errors.name && (
              <FormHelperText>{errors.name.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth error={!!errors.category}>
            <FormLabel required sx={{ color: 'text.secondary', mb: 1 }}>Category</FormLabel>
            <OutlinedInput
              size="small"
              placeholder="Category"
              {...register("category", { required: "Category is required" })}
              sx={{ bgcolor: 'background.paper' }}
            />
            {errors.category && (
              <FormHelperText>{errors.category.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth error={!!errors.ratePerKg}>
            <FormLabel required sx={{ color: 'text.secondary', mb: 1 }}>Rate/Kg</FormLabel>
            <OutlinedInput
              size="small"
              type="number"
              placeholder="0"
              {...register("ratePerKg", {
                required: "Rate per Kg is required",
                valueAsNumber: true,
              })}
              sx={{ bgcolor: 'background.paper' }}
            />
            {errors.ratePerKg && (
              <FormHelperText>{errors.ratePerKg.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth error={!!errors.ratePerPiece}>
            <FormLabel required sx={{ color: 'text.secondary', mb: 1 }}>Rate/Piece</FormLabel>
            <OutlinedInput
              size="small"
              type="number"
              placeholder="0"
              {...register("ratePerPiece", {
                required: "Rate per Piece is required",
                valueAsNumber: true,
              })}
              sx={{ bgcolor: 'background.paper' }}
            />
            {errors.ratePerPiece && (
              <FormHelperText>{errors.ratePerPiece.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth error={!!errors.unit}>
            <FormLabel required sx={{ color: 'text.secondary', mb: 1 }}>Unit</FormLabel>
            <Select
              size="small"
              defaultValue=""
              {...register("unit", { required: "Unit is required" })}
              sx={{ bgcolor: 'background.paper' }}
            >
              <MenuItem value="kg">Kg</MenuItem>
              <MenuItem value="piece">Piece</MenuItem>
              <MenuItem value="meter">Meter</MenuItem>
            </Select>
            {errors.unit && (
              <FormHelperText>{errors.unit.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth error={!!errors.description}>
            <FormLabel sx={{ color: 'text.secondary', mb: 1 }}>Description</FormLabel>
            <OutlinedInput
              size="small"
              multiline
              placeholder="Item Description"
              {...register("description")}
              sx={{ bgcolor: 'background.paper' }}
            />
            {errors.description && (
              <FormHelperText>{errors.description.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button type="submit" variant="contained" color="primary" sx={{ color: 'white' }}>
            Submit Item
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
