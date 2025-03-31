import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";

interface IconButtonWithTooltipProps {
  title: string;
  handleClick: () => void;
  children: React.ReactNode;
}

const IconButtonWithTooltip: React.FC<IconButtonWithTooltipProps> = ({
  title,
  handleClick,
  children,
}) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" onClick={handleClick} sx={{ ml: 1 }}>
        {children}
      </IconButton>
    </Tooltip>
  );
};

export default IconButtonWithTooltip;
