import React from 'react'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'

import './KeybindingsView.sass'

const ElevatedPaper = props => (
  <Paper {...{ ...props, elevation: 6 }}>{props.children}</Paper>
)

const KeybindingsView = () => (
  <div className="KeybindingsView">
    <TableContainer {...{ component: ElevatedPaper }}>
      <Table aria-label="Keyboard Shortcuts">
        <TableBody>
          {[
            { label: 'Show Keyboard Shortcuts (this screen)', keybinding: 'Shift + ?' },
            { label: 'Toggle menu', keybinding: 'M' },
            { label: 'End the day', keybinding: 'Shift + C' },
            { label: 'Go to screen by <1-9> order', keybinding: '<1-9>' },
            { label: 'Go to next screen', keybinding: 'Right arrow key' },
            { label: 'Go to previous screen', keybinding: 'Left arrow key' },
            { label: 'Go to Farm Stats', keybinding: 'S' },
            { label: 'Go to Achievements', keybinding: 'A' },
            { label: "Go to Farmer's Log", keybinding: 'L' },
            { label: 'Go to Price Events', keybinding: 'E' },
            { label: 'Go to Bank Account', keybinding: 'B' },
            { label: 'Go to Settings', keybinding: ',' },
          ].map(({ label, keybinding }) => (
            <TableRow {...{ key: label }}>
              <TableCell {...{ component: 'th', scope: 'row' }}>
                {label}
              </TableCell>
              <TableCell align="right">{keybinding}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <h3>Field-specific keyboard shortcuts</h3>
    <TableContainer {...{ component: ElevatedPaper }}>
      <Table aria-label="Keyboard Shortcuts">
        <TableBody>
          {[
            { label: 'Zoom in', keybinding: '=' },
            { label: 'Zoom out', keybinding: '-' },
          ].map(({ label, keybinding }) => (
            <TableRow {...{ key: label }}>
              <TableCell {...{ component: 'th', scope: 'row' }}>
                {label}
              </TableCell>
              <TableCell align="right">{keybinding}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)

KeybindingsView.propTypes = {}

export default KeybindingsView
