# Refugee Data Visualizer

<img src="./screen_shot.png"/ width="700">

https://refugee-data-viz.herokuapp.com/

### Author: Cyrus Shahrivar
### Date: 12/15/2015

### Technologies Used and Installation Instructions
- D3.js: data visualization library
- NodeJS and Express: server
- HTML/CSS/SVGs: front end development

Please install NodeJS and Express globally on your machine prior to continuing.

If you are not forking or cloning, to do a similar project you will also need to link to the D3.js and topojson libraries in your HTML file.  I recommend also including Underscore.js to simplify your functions.

Finally, to deploy I used Heroku's NodeJS deployment instructions and hosted on Heroku.

### General approach
Initially, I wanted to have this app be both a visualization of refugee resettlement in the US for the recent past and a news scraper that would analyze community sentiment towards refugees, but I quickly decided to just do the visualization only as recent political discourse makes it difficult to find a positive sentiment towards refugee resettlement.  I realized that the visualization tool alone would be of great use in identifying resettlement trends.

I then grabbed data from the Office of Refugee Resettlement (a USDHHS office) and began to look at how the data was structured.  They don't have an external facing API, however, I was able to download datasets in spreadsheet format, export to CSV, then structure the files manually as JSON objects.  Once I had that information, I set out to find appropriate visualization examples from D3 that would be helpful for my website.  I started with code from the D3 website for the map feature and the bar-chart feature, and then I customized the code to fit the visuals I was hoping to display.

In implementing the visualization features, I quickly understood that I needed to do some data sanitization as many numbers were still in quotes if they were greater than 999 due to spreadsheet formatting adding thousand comma separators.  I had to redo the process of getting the data from the spreadsheets by first highlighting all the cells and setting the formatting to use no comma separators, and that fixed the problem.  I was able to re-export to CSVs and redo the JSON files and the data then came in fine.

As I was designing the site, I ran the site by potential users to gauge what features would be helpful. That provided useful feedback for the final design of the site.

NOTE: Puerto Rico and other US territories not included in this data visualization as my map visual was only of the US 50 states.  Puerto Rico and other territories received very few refugees in this analysis period.

### User Stories / Wireframes / Pitch Deck
- Wireframes:
  - https://github.com/cyrus-shahrivar/refugeeDataViz/blob/master/planning/wireframe1.JPG
  - https://github.com/cyrus-shahrivar/refugeeDataViz/blob/master/planning/wireframe2.JPG

- User Stories on Trello
  - https://trello.com/b/FAcCnDkZ/refugee-data-visualization

- Planning
  - https://github.com/cyrus-shahrivar/refugeeDataViz/blob/master/planning/planning.md

- Project Proposal
  - https://github.com/cyrus-shahrivar/refugeeDataViz/blob/master/planning/final-project-proposal.md

### Unsolved Problems
- Adding more data from 2015
- Making friendly to many screen sizes
- Putting data in database instead of JSON objects
