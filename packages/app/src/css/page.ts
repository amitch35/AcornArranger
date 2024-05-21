import { css } from "lit"

export default css`
.page {
    --page-grid-columns: 8;
    display: grid;
    grid-template-columns: [start] repeat(var(--page-grid-columns), 1fr) [end];
    transition: all 0.5s ease;
}

.page header:first-of-type {
    grid-template-columns: subgrid;
    grid-column: start / end;
}

.page main:first-of-type {
    grid-template-columns: subgrid;
    grid-column-start: 2;
    grid-column-end: span 6;
}

.page > .page-split-left {
    grid-template-columns: subgrid;
    grid-column-start: start;
    grid-column-end: span 4;
}

.page > .page-split-right {
    grid-template-columns: subgrid;
    grid-column-start: 5;
    grid-column-end: span 4;
}

.dark-mode-only {
    display: none;
}

.dark-mode .dark-mode-only {
    display: contents;
}

.light-mode-only {
    display: contents;
}

.dark-mode .light-mode-only {
    display: none;
} 

header {
    color: var(--text-color-header);
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: var(--background-color-header);
    line-height: 1;
    padding: var(--spacing-size-medium);
}

header img {
    width: auto;
    height: auto;
    max-width: calc(var(--text-font-size-xxxlarge) + 1rem);
    max-height: calc(var(--text-font-size-xxxlarge) + 1rem);
}

h1 { 
    font-size: var(--text-font-size-xxxlarge);
    font-family: var(--text-font-family-display);
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
}

h2 { 
    font-size: var(--text-font-size-xxlarge); 
}

h3 { font-size: var(--text-font-size-xlarge); }

h4 { font-size: var(--text-font-size-large); }

h5 { font-size: var(--text-font-size-medium); }

h6 { font-size: var(--text-font-size-body); }

h2, h3, h4, h5, h6 {
    font-family: var(--text-font-family-display);
    font-optical-sizing: auto;
    font-weight: var(--text-font-weight-light);
    font-style: normal;
    padding: var(--spacing-size-medium);
}

a {
    color: var(--text-color-link);
}

table {
    /* margin: var(--spacing-size-medium); */
    width: 100%;
    border-collapse: collapse;
    border: 2px solid;
    border-color: var(--accent-color);
    border-radius: var(--border-size-radius);
}

th, td {
    /* border: 1px solid rgb(160 160 160); */
    border: 1px solid;
    border-color: var(--accent-color);
    padding: 4px 16px;
}

th {
    font-weight: var(--text-font-weight-bold);
}

dl {
    margin-left: var(--spacing-size-medium);
}

dt {
    margin-bottom: var(--spacing-size-xsmall);
}

dd {
    margin-bottom: var(--spacing-size-medium);
    margin-left: var(--spacing-size-small);
}

button {
    color: currentColor;
    border-color: currentColor;
    border-style: solid;
    border-radius: var(--border-size-radius);
    background-color: inherit;
    height: fit-content;
}

button:hover {
    background-color: var(--background-color-accent); 
}

button * {
    padding: 0;
}

strong {
    font-weight: var(--text-font-weight-bold);
}

em {
    font-family: var(--text-font-family-body);
    font-weight: var(--text-font-weight-body);
    font-style: italic;
}

/* Mono */
.roboto-mono-code-snippet {
    font-family: Roboto Mono, Consolas, monaco, monospace;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
}

/* Body Text */
.roboto-regular {
    font-family: Roboto, Arial, Helvetica Neue, Helvetica, sans-serif;
    font-weight: 400;
    font-style: normal;
}
  
.roboto-medium {
    font-family: Roboto, Arial, Helvetica Neue, Helvetica, sans-serif;
    font-weight: 500;
    font-style: normal;
}

.roboto-regular-italic {
    font-family: Roboto, Arial, Helvetica Neue, Helvetica, sans-serif;
    font-weight: 400;
    font-style: italic;
}

/* Display Text */
.roboto-slab-main-title {
    font-family: Roboto Slab, Rockwell, Georgia, Times, Times New Roman, serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
} 

.roboto-slab-title {
    font-family: Roboto Slab, Rockwell, Georgia, Times, Times New Roman, serif;
    font-optical-sizing: auto;
    font-weight: 300;
    font-style: normal;
} 
`