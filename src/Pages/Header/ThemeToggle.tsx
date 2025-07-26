import IconWrapper from "../../Components/IconWrapper.js";

export interface ThemeToggleProps {
  onToggle: () => void;
  isPrimary: boolean;
  primaryIcon?: React.ElementType;
  secondaryIcon?: React.ElementType;
  tooltip?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  onToggle,
  isPrimary,
  primaryIcon,
  secondaryIcon,
  tooltip
}) => {
  return (
    <button className="theme-toggle" onClick={onToggle}>
      {IconWrapper(isPrimary ? primaryIcon : secondaryIcon, 20, '#fff')}
      {tooltip && <span className="tooltip-toggle-text">{tooltip}</span>}
    </button>
  );
};

export default ThemeToggle;
