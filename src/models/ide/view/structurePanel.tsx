import React from 'react';
import { TreeItem, TreeView } from '@mui/lab';
import { useTheme } from '@mui/styles';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { blue, grey } from '@mui/material/colors';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Groups, UnitsWatchList } from '../units-watch-list';
import { Unit, Node } from '../../../types';

const unitsPriorities: Record<keyof typeof Groups, number> = {
  domains: 0,
  stores: 1,
  events: 2,
  effects: 3,
};

type Group = keyof typeof Groups;

export const StructurePanel = ({ data, editor }: { data: UnitsWatchList, editor: any }) => {
  const setPos = (unit: Node) => {
    // const loc = unit.defaultConfig.loc;
    console.log(unit);
  };
  // editor.setPosition({ column: 3, lineNumber: 3 });

  let unitsCount = 0;

  const units = Object.entries(data)
    .sort(([a], [b]) => unitsPriorities[a as Group] - unitsPriorities[b as Group])
    .filter(([group, units]) => units.length !== 0)
    .map(([group, units]) => (
      <TreeItem
        key={group}
        label={
          <Box display="flex" alignItems="baseline">
            <Typography variant="tree-group">
              {group}
            </Typography>
            <Typography variant="caption" color={blue[600]}>
              {units.length}
            </Typography>
          </Box>
        }
        nodeId={group}
        role="group"
        sx={{ width: 170 }}
      >
        {units.map((unit, i) => (
          <TreeItem key={unitsCount++}
                    nodeId={unit.id}
                    onClick={() => setPos(unit)}
                    label={unit.meta.name}
          />
        ))}
      </TreeItem>
    ));

  const theme = useTheme();

  return (
    <Box sx={{
      flexShrink: 0,
      flexGrow: 1,
      maxWidth: 200,
      minWidth: 200,
      display: 'flex',
      flexDirection: 'column',
      borderRight: 1,
      borderColor: grey[500],
    }}>
      <Typography
        variant="title"
        // @ts-ignore
        bgcolor={theme.palette.primary.main}
        color="white"
        boxShadow={4}
        zIndex={1}
      >
        Structure
      </Typography>
      {unitsCount > 0
        ? (
          <TreeView
            defaultExpanded={Object.keys(unitsPriorities)}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              height: 'auto',
              py: 1,
            }}
          >
            {units}
          </TreeView>
        ) : (
          <Typography variant="h5" m="auto" color={grey[500]}>
            No units
          </Typography>
        )
      }
    </Box>
  );
};
