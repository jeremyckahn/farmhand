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
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Show Keyboard Shortcuts
            </TableCell>
            <TableCell align="right">?</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)

KeybindingsView.propTypes = {}

export default KeybindingsView
