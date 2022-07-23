import * as shell from "shelljs";

// Copy all the view templates and assets to the dist folder
shell.cp( "-R", "src/views", "dist/src/" );
shell.cp( "-R", "src/public", "dist/src/" );