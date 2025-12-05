# India TopoJSON Data

To enable the interactive map feature, place an India topojson file at `src/data/india.topo.json`.

You can find India topojson data from:
- [Natural Earth Data](https://www.naturalearthdata.com/)
- [DataHub](https://datahub.io/)
- [GitHub repositories](https://github.com/search?q=india+topojson)

The file should contain Indian states with properties like:
- `STATE_CODE` or `state_code` for unique identification
- State boundaries as topojson geometries

If the file is not present, the component will automatically fallback to a list view of states.
