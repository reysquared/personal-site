// TODO|kevin lessgooo

// const preferDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

/*
okay so let's think through this.
I CAN set media queries... which could be greatly simplified through the use of scss variables probably
i.e. I could POSSIBLY condense the full color schemes into individual variables for simpler query config
EDIT: no but you can do that through mixins lol.

The real wrinkle is that I want it to correctly honor dark mode preference if
the browser supports it, EVEN when the user has JS disabled. I can only do that
with ACTUAL media queries.
*/