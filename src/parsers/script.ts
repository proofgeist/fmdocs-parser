const fxp = require("fast-xml-parser");
import commentParser from "./scriptParseComments";

export default (xml: string, folderFilter: Array<string> = []) => {
  const options = {
    attributeNamePrefix: "",
    ignoreTextNodeAttr: false,
    ignoreAttributes: false,
    ignoreNonTextNodeAttr: false,
    arrayMode: true,
    textNodeName: "$"
  };

  const obj = fxp.parse(xml, options);
  const scriptBlock = obj.fmxmlsnippet;
  const scripts = scriptBlock[0];

  const handleGroups = (groups: any, currentPath: string) => {
    if (!groups) return [];
    let result: any = [];
    groups.map((group: any) => {
      let groupResults: any;

      const GroupPath = currentPath + "/" + group.name;
      result = result.concat(dodad(group, GroupPath));
    });
    return result;
  };

  const dodad = (scripts: any, currentPath: string = "") => {
    const ScriptArray = scripts.Script;

    let details;
    if (ScriptArray) {
      details = ScriptArray.map((script: any) => {
        const commentBlock = commentParser(script);
        let pathArray = currentPath.split("/");
        pathArray.shift();
        pathArray = pathArray.filter((item: string) => {
          return item.toLowerCase() !== "public";
        });
        return {
          apiGroup: pathArray,
          apiFullQaulifedGroup: pathArray.join("."),
          path: currentPath + "/" + script.name,
          scriptName: script.name,
          commentBlock
        };
      });
    } else {
      details = [];
    }

    const Groups = scripts.Group;

    let groupResults = handleGroups(Groups, currentPath);

    return details.concat(groupResults);
  };

  let allScripts = dodad(scripts, "");
  allScripts = allScripts.filter((script: any) => {
    return script.scriptName !== "-";
  });

  const r = allScripts.filter((script: any) => {
    let result: boolean = true;
    folderFilter.forEach((folder: string) => {
      if (!script.path.includes(folder)) {
        result = false;
      }
    });

    return result;
  });

  return r;
};
