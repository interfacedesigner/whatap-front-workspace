# Web Accessibility Guidelines

This rule provides guidelines for developing accessible React components that comply with WCAG 2.1 AA level standards.

## Core Principles

### 1. Perceivable

- All content must be perceivable by users
- Alternative information must be provided for visual content

### 2. Operable

- All functionality must be operable via keyboard
- Sufficient time must be provided for users

### 3. Understandable

- Information and UI operation methods must be understandable
- Must operate in predictable ways

### 4. Robust

- Must be compatible with various assistive technologies

## Essential Implementation Requirements

### 1. Use Semantic HTML

```typescript
// ✅ Correct example
const Button = () => (
  <button type="button" onClick={handleClick}>
    Click me
  </button>
);

const Navigation = () => (
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/home">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
);

// ❌ Incorrect example
const Button = () => (
  <div onClick={handleClick}>Click me</div>
);
```

### 2. ARIA Attributes Usage

```typescript
// ✅ Correct example
const Modal = ({ isOpen, onClose, title, children }) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
  >
    <h2 id="modal-title">{title}</h2>
    <div id="modal-description">{children}</div>
    <button onClick={onClose} aria-label="Close modal">
      ×
    </button>
  </div>
);

const ExpandableSection = ({ title, children, isExpanded, onToggle }) => (
  <div>
    <button
      aria-expanded={isExpanded}
      aria-controls="content-section"
      onClick={onToggle}
    >
      {title}
    </button>
    <div id="content-section" hidden={!isExpanded}>
      {children}
    </div>
  </div>
);
```

### 3. Keyboard Navigation Support

```typescript
// ✅ Keyboard event handling
const KeyboardNavigableList = ({ items, onSelect }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(items[focusedIndex]);
        break;
      case 'Escape':
        e.preventDefault();
        // Focus release logic
        break;
    }
  };

  return (
    <ul role="listbox" onKeyDown={handleKeyDown}>
      {items.map((item, index) => (
        <li
          key={item.id}
          role="option"
          tabIndex={index === focusedIndex ? 0 : -1}
          aria-selected={index === focusedIndex}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
};
```

### 4. Focus Management

```typescript
// ✅ Focus trap implementation
const FocusTrap = ({ children }) => {
  const trapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trap = trapRef.current;
    if (!trap) return;

    const focusableElements = trap.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    trap.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      trap.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <div ref={trapRef}>{children}</div>;
};
```

### 5. Alternative Text and Labels

```typescript
// ✅ Correct example
const ImageWithAltText = ({ src, alt, decorative = false }) => (
  <img
    src={src}
    alt={decorative ? "" : alt}
    role={decorative ? "presentation" : undefined}
  />
);

const FormField = ({ label, error, children }) => {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {React.cloneElement(children, {
        id,
        'aria-describedby': errorId,
        'aria-invalid': !!error,
      })}
      {error && (
        <div id={errorId} role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
};
```

### 6. Color and Contrast

```typescript
// Accessibility-focused styling with PandaCSS
const AccessibleButton = cva('button', {
  base: {
    // Ensure minimum 4.5:1 contrast ratio
    backgroundColor: 'blue.600',
    color: 'white',
    border: '2px solid transparent',

    // Focus indicator
    _focus: {
      outline: '2px solid blue.400',
      outlineOffset: '2px',
    },

    // Disabled state
    _disabled: {
      backgroundColor: 'gray.400',
      color: 'gray.600',
      cursor: 'not-allowed',
    },

    // Hover state
    _hover: {
      backgroundColor: 'blue.700',
      _disabled: {
        backgroundColor: 'gray.400',
      },
    },
  },
});
```

### 7. Motion and Animation Accessibility

**Always respect user motion preferences** to support users with vestibular disorders, epilepsy, ADHD, or other conditions where motion can cause discomfort or health issues.

```typescript
// ✅ Respect prefers-reduced-motion
const AccessibleComponent = cva('component', {
  base: {
    // Regular transition
    transition: 'all 0.3s ease-in-out',

    // Disable animations for users who prefer reduced motion
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      animation: 'none',
    },
  },
});

// ✅ Conditional animations
const AnimatedButton = () => {
  const prefersReducedMotion = useMedia('(prefers-reduced-motion: reduce)');

  return (
    <button
      className={css({
        transform: 'scale(1)',
        transition: prefersReducedMotion ? 'none' : 'transform 0.2s ease',
        _hover: {
          transform: prefersReducedMotion ? 'scale(1)' : 'scale(1.05)',
        },
      })}
    >
      Click me
    </button>
  );
};

// ✅ Loading animations with reduced motion support
const LoadingSpinner = () => (
  <div
    className={css({
      animation: 'spin 1s linear infinite',
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
        // Show static indicator instead
        '&::after': {
          content: '"⏳"',
        },
      },
    })}
  >
    🔄
  </div>
);

// ❌ Avoid: Ignoring motion preferences
const BadComponent = () => (
  <div
    className={css({
      animation: 'bounce 2s infinite', // Always animates regardless of user preference
    })}
  />
);
```

**Key Guidelines for Motion:**

- Always include `@media (prefers-reduced-motion: reduce)` for any animations or transitions
- Provide alternative static indicators for loading states
- Consider motion intensity - subtle animations may be acceptable even with reduced motion
- Test with motion preferences disabled in browser settings

### 8. Live Regions

```typescript
// ✅ Status change notifications
const StatusMessage = ({ message, type = 'polite' }) => (
  <div
    role="status"
    aria-live={type}
    aria-atomic="true"
    className={css({
      position: 'absolute',
      left: '-10000px',
      width: '1px',
      height: '1px',
      overflow: 'hidden'
    })}
  >
    {message}
  </div>
);

const FormWithValidation = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <form>
      {/* Form fields */}

      {/* Error messages */}
      {errors.length > 0 && (
        <div role="alert" aria-live="assertive">
          <h3>Please fix the following errors:</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <StatusMessage message={successMessage} type="polite" />
      )}
    </form>
  );
};
```

### 9. Table Accessibility

```typescript
// ✅ Accessible table
const AccessibleTable = ({ data, columns }) => (
  <table role="table">
    <caption>User data table</caption>
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={column.key} scope="col">
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((column, colIndex) => (
            <td key={column.key} scope={colIndex === 0 ? "row" : undefined}>
              {row[column.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
```

## Validation Tools and Testing

### 1. Automated Testing Tools

- Automated accessibility testing with `@axe-core/react`
- Static analysis with `eslint-plugin-jsx-a11y`

### 2. Manual Testing

- Verify all functionality is accessible via keyboard only
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Check color contrast with contrast checking tools

### 3. Writing Test Code

```typescript
// Accessibility testing with Jest + Testing Library
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button component accessibility test', async () => {
  const { container } = render(
    <Button onClick={() => {}}>Click me</Button>
  );

  // axe accessibility check
  const results = await axe(container);
  expect(results).toHaveNoViolations();

  // Screen reader text verification
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
});
```

## Component-Specific Checklist

### Button

- [ ] Use `button` element or appropriate `role`
- [ ] Provide clear label or `aria-label`
- [ ] Keyboard focusable
- [ ] Indicate disabled state

### Form

- [ ] Connect labels to all input fields
- [ ] Mark required fields (`aria-required="true"`)
- [ ] Associate error messages with fields (`aria-describedby`)
- [ ] Announce form submission results

### Navigation

- [ ] Use `nav` element
- [ ] Describe with `aria-label` or `aria-labelledby`
- [ ] Indicate current page (`aria-current`)
- [ ] Support keyboard navigation

### Modal/Dialog

- [ ] Use `role="dialog"` and `aria-modal="true"`
- [ ] Implement focus trap
- [ ] ESC key to close functionality
- [ ] Block access to background elements

Following these guidelines will help you create web applications accessible to all users.
