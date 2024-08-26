# TornadoTrack

Create a dashboard for viewing TornadoCash usage over time.

Features:
- The dashboard will allow you to see usage on different chains.
- The dashboard will show the last x transactions, along with a live update.
- The dashboard at its core will be a stacked bar chart showing on a x-ly basis, how many deposits of sum y were made to the mixer.
- Dashboard could also show total value locked in mixer as a chart.
- [TBD] Overlay value of ETH/USD?

Tech Stack:
- HyperSync to get live data on a side panel and show last x transactions
- HyperIndex to get historical data on all chains
- Backend django server for hosting and serving the pages
- [TBD] Frontend Jinja?