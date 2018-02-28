const commentBlockLineArray = (steps: any) => {
  if (!steps) return null;
  const commentSteps = steps.filter((step: any) => {
    return step.id === "89" && step.enable === "True";
  });

  const commentTextArray = commentSteps.map(commentStep => {
    return commentStep.StepText
      ? commentStep.StepText[0]
      : commentStep.Text ? commentStep.Text[0] : "";
  });

  let commentTextLines: string = "";
  commentTextArray.forEach((commentText: any) => {
    commentTextLines = commentTextLines + "/n" + commentText;
  });

  const start = commentTextLines.indexOf("/##");
  const end = commentTextLines.indexOf("#//");
  const commentBlock = commentTextLines.substr(start, end);
  let commentArray: Array<{}> = commentBlock.split("/n");
  commentArray = commentArray.filter((item: string) => {
    return item !== "" && !item.includes("/##") && !item.includes("#/");
  });

  commentArray = commentArray.map((item: string) => {
    const tag = ((line: string) => {
      const start = line.indexOf("@");
      if (start === -1) {
        return "description";
      }
      const end = line.indexOf(" ", start);
      return line.substring(start + 1, end);
    })(item);

    if (tag === "description" || tag === "author") {
      let description = item.substr(1).trim();
      if (description.includes("@")) {
        let s = description.split(" ");
        s.shift();
        description = s.join(" ");
      }
      return {
        type: tag,
        value: description
      };
    }
    const value = ((item: string) => {
      const start = item.indexOf("{") + 1;
      const end = item.indexOf("}");
      const type = item.substring(start, end);
      const itemAfterType = item.split("}")[1].trim();
      const parts: any = itemAfterType.split(" ");
      let name = parts.shift();
      const optional = name.startsWith("[") && name.endsWith("]");
      let t: string = "";
      if (optional) {
        name = name.substring(1, name.length - 1);
        const split = name.split("=");
        name = split[0];
        t = split[1];
      }
      const description = parts.join(" ");
      return {
        type,
        name,
        description,
        optional,
        default: t
      };
    })(item);

    return {
      class: tag,
      value
    };
  });
  console.log(commentArray);
  return commentArray;
};

const commentBlockObj = (script: any) => {
  // const script = scriptBlock[0].Script[0];
  const steps = script.StepList ? script.StepList[0].Step : script.Step;

  const comments = commentBlockLineArray(steps);
  if (!comments) return null;
  const obj: any = {};
  comments.map((commentLine: any) => {
    const type = commentLine.type;
    if (type === "description" || type === "author") {
      obj[type] = obj[type]
        ? obj[type] + "/r" + commentLine.value
        : commentLine.value;
    } else {
      const theClass = commentLine.class;
      if (!obj[theClass]) obj[theClass] = [];
      obj[theClass].push(commentLine.value);
    }
  });
  return obj;
};

export default commentBlockObj;
