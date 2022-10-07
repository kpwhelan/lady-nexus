import React from 'react';
import Select from 'react-select';

function SelectBox({ beginFilter, categoryFilters }) {
  return (
    <Select
        options={categoryFilters}
        isMulti={true}
        isSearchable={false}
        placeholder="Filter by category"
        onChange={beginFilter}
        theme={(theme) => ({
            ...theme,
            borderRadius: 5,
            colors: {
            ...theme.colors,
                primary25: '#5f7d54',
                primary: '#5f7d54',
            },
            })}
    />
  )
}

export default SelectBox
