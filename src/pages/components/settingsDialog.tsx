import Dialog from '@mui/material/Dialog';
import Settings from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

import * as React from 'react';
import { AppBar, FormControlLabel, IconButton, Toolbar } from '@mui/material';


export default function SettingsDialog(props) {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function updateSetting(field, value){
    let newConfig = Object.assign({}, props);
    newConfig[field]= value;
    console.log(newConfig)
    props.onUpdateSetting(newConfig);
  }

  const onShowCompletedChecked = (checked: boolean) => {
    updateSetting("showCompleted", checked);
  }

  return (
    <div className="settings-fab">
      <IconButton
        edge="start"

        color="primary"
        onClick={() => { handleClickOpen() }}
        aria-label="settings"
      >
        <Settings />
      </IconButton>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Settings
            </Typography>
            <IconButton
              edge="start"
              className='settings-button'
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List >
          <ListItem>
            <FormControlLabel sx={{ ml: 1, flex: 1 }} control={
              <Checkbox
                edge="start"
                checked={props?.settings?.showCompleted}
                onChange={e => {
                  onShowCompletedChecked(e.target.checked);
                }}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': "showCompleted" }}
              />
            } label="Show completed checklists" />
          </ListItem>
          <Divider />
        </List>
      </Dialog>
    </div>
  );
}
