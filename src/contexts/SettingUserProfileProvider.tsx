import {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
  } from 'react';
  
  export type SettingView = 'profile' | 'account' | 'notification';
  
  interface SettingContextValue {
    view: SettingView;
    setView: Dispatch<SetStateAction<SettingView>>;
  }
  
  // 3. Create context
  const SettingContext = createContext<SettingContextValue | undefined>(undefined);
  
  // 4. Provider component
  export function SettingUserProfileProvider({
    children,
  }: {
    children: ReactNode;
  }) {
    const [view, setView] = useState<SettingView>('profile');
  
    return (
      <SettingContext.Provider value={{ view, setView }}>
        {children}
      </SettingContext.Provider>
    );
  }
  
  export function useSettingView(): SettingContextValue {
    const ctx = useContext(SettingContext);
    if (!ctx) {
      throw new Error(
        'useSettingView must be used within a SettingUserProfileProvider'
      );
    }
    return ctx;
  }
  