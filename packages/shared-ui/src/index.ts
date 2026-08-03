'use client';

export {
  ThemeProvider,
  useTheme,
  useCurrentTheme,
  useThemeColors,
  useThemeMode,
  ThemeEngine,
  ThemeSwitcher,
  ColorUtils,
  ThemeValidator,
  type ThemeConfig,
  type ThemeColors,
  type ThemeMode,
} from '@mindfiredigital/ignix-ui';

export { cn } from './utils/cn';

// Radix UI components kept for lack of Ignix equivalents
export * from './components/ui/alert-dialog';
export * from './components/ui/label';
export * from './components/ui/select';
export * from './components/ui/separator';

// Ignix UI Components
export { Avatar, AvatarGroup } from './components/ui/avatar/index';
export { Badge } from './components/ui/badge/index';
export { Button, buttonVariants } from './components/ui/button/index';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  FeatureCard,
  StatCard,
} from './components/ui/card/index';
export { Checkbox } from './components/ui/checkbox/index';
export {
  DialogContext,
  DialogProvider,
  type DialogRef,
  type DialogTypes,
  type DialogAnimationTypes,
} from './components/ui/dialogbox/index';
export { Drawer } from './components/ui/drawer/index';
export {
  Dropdown,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownLabel,
  DropdownSeparator,
} from './components/ui/dropdown/index';
export { Form, FormField, InputWrapper } from './components/ui/form/index';
export { AnimatedInput as Input } from './components/ui/input/index';
export { Modal } from './components/ui/modal/index';
export { Pagination } from './components/ui/pagination/index';
export { RadioGroup } from './components/ui/radio/index';
export {
  Sidebar,
  SidebarProvider,
  useSidebar,
} from './components/ui/sidebar/index';
export { Switch } from './components/ui/switch/index';
export { Table } from './components/ui/table/index';
export { Tabs } from './components/ui/tabs/index';
export { default as Textarea } from './components/ui/textarea/index';
export { Tooltip } from './components/ui/tooltip/index';
