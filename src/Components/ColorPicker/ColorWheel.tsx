import  {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';


class ColorWheel {
  private container: HTMLDivElement;
  private onChange?: (colors: { bg: string; primary: string }) => void;

  constructor(
    container: HTMLDivElement,
    onChange?: (colors: { bg: string; primary: string }) => void
  ) {
    this.container = container;
    this.onChange = onChange;
    this.init();
  }

  private init() {
    this.container.innerHTML = '';
    const picker = document.createElement('div');
    picker.className = 'color-wheel-picker';

    // Add color inputs
    picker.appendChild(this.createColorInput('Background', '--color-bg'));
    picker.appendChild(this.createColorInput('Accent', '--color-primary'));

    this.container.appendChild(picker);
  }

  private createColorInput(label: string, cssVar: string) {
    const wrapper = document.createElement('div');
    wrapper.className = 'color-input-wrapper';

    const input = document.createElement('input');
    input.type = 'color';
    input.className = 'color-input';

    // Get the current color from CSS variables
    const currentColor = getComputedStyle(document.documentElement)
      .getPropertyValue(cssVar)
      .trim();
    input.value = currentColor;

    // Set tooltip with color value
    wrapper.setAttribute('data-tooltip', `${label}: ${currentColor}`);

    input.addEventListener('input', (e) => {
      const color = (e.target as HTMLInputElement).value;
      document.documentElement.style.setProperty(cssVar, color);
      wrapper.setAttribute('data-tooltip', `${label}: ${color}`);

      this.onChange?.({
        bg: getComputedStyle(document.documentElement)
          .getPropertyValue('--color-bg')
          .trim(),
        primary: getComputedStyle(document.documentElement)
          .getPropertyValue('--color-primary')
          .trim(),
      });
    });

    wrapper.appendChild(input);
    return wrapper;
  }
}

export interface ColorWheelProps {
  onChange?: (colors: { bg: string; primary: string }) => void;
}


const ColorWheelComponent = forwardRef<HTMLDivElement, ColorWheelProps>(
  ({ onChange}, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wheelRef = useRef<ColorWheel | null>(null);

    useImperativeHandle(ref, () => {
      if (!containerRef.current) {
        throw new Error('Container ref is not available');
      }
      return containerRef.current;
    });

    useEffect(() => {
      if (containerRef.current) {
        wheelRef.current = new ColorWheel(containerRef.current, onChange);
      }
      return () => {
        const root = document.documentElement;
        ['--color-bg', '--color-primary'].forEach((prop) => {
          root.style.removeProperty(prop);
        });
      };
    }, [onChange]);

    return (
      <div ref={containerRef} className={`color-wheel-picker-container`}/>
    );
  }
);

export default ColorWheelComponent;