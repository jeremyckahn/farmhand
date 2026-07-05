import { useCallback } from 'react'

export const useFarmhandNavigation = (
  setState: React.Dispatch<React.SetStateAction<farmhand.state>>,
  viewList: farmhand.stageFocusType[]
) => {
  const openDialogView = useCallback(
    (dialogViewName: farmhand.dialogView) => {
      setState(previous => ({
        ...previous,
        currentDialogView: dialogViewName,
        isDialogViewOpen: true,
      }))
    },
    [setState]
  )

  const closeDialogView = useCallback(() => {
    setState(previous => ({ ...previous, isDialogViewOpen: false }))
  }, [setState])

  const focusNextView = useCallback(() => {
    if (document.activeElement?.getAttribute('role') === 'tab') return
    setState((previous: farmhand.state) => {
      const currentViewIndex = viewList.indexOf(previous.stageFocus)

      return {
        ...previous,
        stageFocus: viewList[(currentViewIndex + 1) % viewList.length],
      }
    })
  }, [setState, viewList])

  const focusPreviousView = useCallback(() => {
    if (document.activeElement?.getAttribute('role') === 'tab') return

    setState((previous: farmhand.state) => {
      const currentViewIndex = viewList.indexOf(previous.stageFocus)

      const viewIdx =
        currentViewIndex === 0
          ? viewList.length - 1
          : (currentViewIndex - 1) % viewList.length

      return {
        ...previous,
        stageFocus: viewList[viewIdx],
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
