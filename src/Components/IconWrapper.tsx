const IconWrapper = (IconComponent?: React.ElementType, size = 28, color = '#ff6a1a') => {
  if (!IconComponent) return null;
  return (
    <IconComponent
      width={size}
      height={size}
      stroke={color}
      style={{ marginBottom: 0 }}
    />
  );
};

export default IconWrapper