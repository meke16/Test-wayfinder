import { useTheme } from './theme-provider'
import { ThemeSwitcher } from '@/components/theme-switcher'

const ModeToggle = () => {
  const { setTheme, theme } = useTheme()

  return (
    <ThemeSwitcher defaultValue="system" onChange={setTheme} value={theme} />
  )
}

export default ModeToggle
