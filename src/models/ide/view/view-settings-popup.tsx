import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Checkbox, FormGroup, InputLabel, MenuItem, Paper, Popover, Select, Tooltip } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { LabelModes, LayoutSubMode } from '../../types';
import { LabelModesMap } from '../../const';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Icon from '@mui/material/Icon';
import { green, grey, red } from '@mui/material/colors';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { toolbarButtonStyle } from './styles';
import { ViewSettings } from '../view-settings';

type ControlCenterProps = {
  data: any,
  mode: ViewSettings,
  onChange: (value: ViewSettings) => void,
}

const radio = {
  textAlign: 'center',
};

const columnLabel = {
  width: 42,
  textAlign: 'center',
};

const radioLabel = {
  '& > span': {
    width: 60,
    textAlign: 'right',
  },
};

const formControl = {
  m: 2,
  flexGrow: 1,
  '& > legend': {
    margin: '10px 0',
  },
};

export const ViewSettingsPopup = ({ mode, onChange }: ControlCenterProps) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return <>
    <Button onClick={handleClick} sx={toolbarButtonStyle}>
      View options
    </Button>

    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Paper sx={{
        p: 3,
        width: 280,
        display: 'flex',
        flexFlow: 'column nowrap',
        gap: 2,
      }}>
        <FormControl>
          <InputLabel id="display-name">Display Name</InputLabel>
          <Select
            label="Display Name"
            labelId="display-name"
            value={mode.labels}
            onChange={(e) => onChange({ ...mode, labels: e.target.value as LabelModes })}
          >
            {Object.entries(LabelModesMap).map(([id, label]) => (
              <MenuItem key={id} value={id}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">Edges visibility</FormLabel>
          <FormGroup row style={{ background: '#00000000', padding: '4px 0' }}>
            <FormControlLabel control={<></>} label="" sx={radioLabel} />
            <FormControlLabel
              control={
                <Tooltip title="Show edges">
                  <Icon sx={columnLabel} style={{ color: green[500] }}>done</Icon>
                </Tooltip>
              }
              label=""
              sx={{ mb: -0.5 }}
              onClick={() => {
                onChange({
                  ...mode,
                  next: 'visible',
                  owners: 'visible',
                  links: 'visible',
                });
              }}
            />
            <FormControlLabel
              control={
                <Tooltip title="Transparent edges">
                  <Icon sx={columnLabel} style={{ color: grey[500] }}>visibility_off</Icon>
                </Tooltip>
              }
              label=""
              sx={{ mb: -0.5 }}
              onClick={() => {
                onChange({
                  ...mode,
                  next: 'transparent',
                  owners: 'transparent',
                  links: 'transparent',
                });
              }}
            />
            <FormControlLabel
              control={
                <Tooltip title="Hide edges">
                  <Icon sx={columnLabel} style={{ color: red[500] }}>close</Icon>
                </Tooltip>
              }
              label=""
              sx={{ mb: -0.5 }}
              onClick={() => {
                onChange({
                  ...mode,
                  next: 'removed',
                  owners: 'removed',
                  links: 'removed',
                });
              }}
            />
          </FormGroup>

          <RadioGroup
            aria-label="next"
            name="next"
            value={mode.next}
            onChange={(_, value) => {
              onChange({ ...mode, next: value as LayoutSubMode });
            }}
            row
          >
            <FormControlLabel control={<></>} label="next" sx={radioLabel} />
            <FormControlLabel label="" value="visible" control={<Radio sx={radio} />} />
            <FormControlLabel label="" value="transparent" control={<Radio sx={radio} />} />
            <FormControlLabel label="" value="removed" control={<Radio sx={radio} />} />
          </RadioGroup>

          <RadioGroup
            aria-label="owners"
            name="owners"
            value={mode.owners}
            onChange={(_, value) => {
              onChange({ ...mode, owners: value as LayoutSubMode });
            }}
            row
          >
            <FormControlLabel control={<></>} label="owners" sx={radioLabel} />
            <FormControlLabel label="" value="visible" control={<Radio sx={radio} />} />
            <FormControlLabel label="" value="transparent" control={<Radio sx={radio} />} />
            <FormControlLabel label="" value="removed" control={<Radio sx={radio} />} />
          </RadioGroup>

          <RadioGroup
            aria-label="links" name="links"
            value={mode.links}
            onChange={(_, value) => {
              onChange({ ...mode, links: value as LayoutSubMode });
            }}
            row
          >
            <FormControlLabel control={<></>} label="links" sx={radioLabel} />
            <FormControlLabel label="" value="visible" control={<Radio sx={radio} />} />
            <FormControlLabel label="" value="transparent" control={<Radio sx={radio} />} />
            <FormControlLabel label="" value="removed" control={<Radio sx={radio} />} />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">Style</FormLabel>
          <FormGroup row={true}>
            <FormControlLabel
              control={<Checkbox
                checked={mode.styled}
                onChange={(e, value) => {
                  onChange({ ...mode, styled: value });
                }}
              />}
              label="Shapes"
            />
            <FormControlLabel
              control={<Checkbox
                checked={mode.colored}
                onChange={(e, value) => {
                  onChange({ ...mode, colored: value });
                }}
              />}
              label="Colors"
            />
          </FormGroup>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">Domains visibility options</FormLabel>
          <FormGroup row={true}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={mode.domains}
                  onChange={() => {
                    onChange({ ...mode, domains: !mode.domains });
                  }}
                />
              }
              label="Show domains"
            />
            <FormControlLabel
              control={
                <Checkbox
                  disabled={!mode.domains}
                  checked={mode.internals}
                  onChange={() => {
                    onChange({ ...mode, internals: !mode.internals });
                  }}
                />
              }
              label="Show domains internal units"
            />
          </FormGroup>
        </FormControl>
      </Paper>
    </Popover>
  </>;
};
