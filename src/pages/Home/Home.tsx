import MainGrid from "../../components/MainGrid/MainGrid";
import { GlobalUIService } from "../../utils/GlobalUIService";
import Button from "@mui/material/Button";

function Home() {
  const handleClickOpen = () => {
    GlobalUIService.showToast("testing works");
  };
  // setTimeout(() => {
  //   GlobalUIService.setLoading(false);
  // }, 3000);
  return (
    <>
      <MainGrid />
      <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button>
    </>
  );
}

export default Home;
