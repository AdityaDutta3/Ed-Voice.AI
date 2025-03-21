const { mutation } = require("./_generated/server");
import { v } from "convex/values";

export const CreateNewRoom = mutation({
  args: {
    coachingOption: v.string(),
    topic: v.string(),
    expertName: v.string(),
  },

  handler:async(convexToJson,args)=>{
    const result = await convexToJson.db.insert('DiscussionRoom',{
        coachingOption:args.coachingOption,
        topic:args.topic,
        expertName:args.expertName
    });

    return result;
  }
});
