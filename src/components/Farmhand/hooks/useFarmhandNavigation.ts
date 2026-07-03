import { useCallback } from 'react'

export function useFarmhandNavigation(
  setState: React.Dispatch<React.SetStateAction<farmhand.state>>,
  viewList: farmhand.stageFocusType[]
) {
  const openDialogView = useCallback(
    (dialogViewName: farmhand.dialogView) => {
      setState(s => ({
        ...s,
        currentDialogView: dialogViewName,
        isDialogViewOpen: true,
      }))
    },
    [setState]
  )

  const closeDialogView = useCallback(() => {
    setState(s => ({ ...s, isDialogViewOpen: false }))
  }, [setState])

  const focusNextView = useCallback(() => {
    if (document.activeElement?.getAttribute('role') === 'tab') return
    setState((s: farmhand.state) => {
      const currentViewIndex = viewList.indexOf(s.stageFocus)

      return {
        ...s,
        stageFocus: viewList[(currentViewIndex + 1) % viewList.length],
      }
    })
  }, [setState, viewList])

  const focusPreviousView = useCallback(() => {
    if (document.activeElement?.getAttribute('role') === 'tab') return
    setState((s: farmhand.state) => {
      const currentViewIndex = viewList.indexOf(s.stageFocus)

      return {
        ...s,
        stageFocus:
          viewList[
            currentViewIndex === 0
              ? viewList.length - 1
              : (currentViewIndex - 1) % viewList.length
          ],
      }
    })
  }, [setState, viewList])

  return {
    openDialogView,
    closeDialogView,
    focusNextView,
    focusPreviousView,
  }
}
