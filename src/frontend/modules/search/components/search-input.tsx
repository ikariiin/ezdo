import * as React from 'react';
import { Paper, MenuItem, Menu, ListItemIcon } from '@material-ui/core';
import "../scss/search-input.scss";
import { SearchCategory } from './search';
import SearchIcon from '@material-ui/icons/Search';
import DropDownIcon from '@material-ui/icons/KeyboardArrowDown';

export interface SearchInputProps {
  searchCategory: SearchCategory;
  onCategoryChange: (category: SearchCategory) => any;
  searchTerm: string;
  searchTermOnChange: (ev: React.ChangeEvent<HTMLInputElement>) => any;
}

export const SearchInput: React.FunctionComponent<SearchInputProps> = (props): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  return (
    <Paper className="search-input" elevation={10}>
      <section className="category-select"
        onClick={(ev: React.MouseEvent<HTMLElement>) => setAnchorEl(ev.currentTarget)}>
        From <span className="selected">{props.searchCategory}s</span>
        <DropDownIcon />
      </section>
      <div className="divider" />
      <Menu
        classes={{
          paper: 'category-menu'
        }}
        anchorEl={anchorEl} open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}>
        <MenuItem selected={props.searchCategory === SearchCategory.Task} onClick={() => props.onCategoryChange(SearchCategory.Task) && setAnchorEl(null)}>
          Tasks
        </MenuItem>
        <MenuItem selected={props.searchCategory === SearchCategory.Label} onClick={() => props.onCategoryChange(SearchCategory.Label) && setAnchorEl(null)}>
          Labels
        </MenuItem>
        <MenuItem selected={props.searchCategory === SearchCategory.Group} onClick={() => props.onCategoryChange(SearchCategory.Group) && setAnchorEl(null)}>
          Groups
        </MenuItem>
      </Menu>
      <SearchIcon className="search-icon" />
      <input
        className="search-input-element"
        onChange={ev => props.searchTermOnChange(ev)}
        value={props.searchTerm}
        placeholder="Start typing here to search..." />
    </Paper>
  );
}