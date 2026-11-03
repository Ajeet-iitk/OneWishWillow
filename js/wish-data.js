/* ============================================================
   ONE WISH WILLOW — story data, part I
   Each domain: how it is granted, four escalating cracks,
   and the price. The engine chooses three cracks + a coda.
   ============================================================ */

(function () {
  "use strict";

  window.WISH_DATA = window.WISH_DATA || { domains: {} };
  const D = window.WISH_DATA.domains;

  Object.assign(D, {

    love: {
      label: "LOVE",
      cost: "BORROWED",
      keywords: [
        /\blove[dsr]?\b/i, /\bloving\b/i, /\bcrush\b/i, /\bsoulmate\b/i,
        /\bgirlfriend\b/i, /\bboyfriend\b/i, /\bpartner\b/i, /\bhusband\b/i,
        /\bwife\b/i, /\bmarry\b/i, /\bmarried\b/i, /\bdating\b/i, /\bromance\b/i,
        /\bvalentine\b/i, /\bkiss(ed|es)?\b/i, /\bex\b/i, /\bheart\b/i,
        /\btogether\b/i, /\bwedding\b/i, /\baffair\b/i
      ],
      strong: [/\bfall in love\b/i, /\blove me\b/i, /\bget .* back\b/i, /\bmy ex\b/i, /\bsoulmate\b/i, /\bnever met\b/i, /\bover (him|her|them)\b/i],
      granted: [
        "The willow gives you love the way a mirror gives you a face: instantly, completely, and only from one direction. Someone will love you. You will never again be able to tell whether they chose to.",
        "It lifts the wanting out of your chest and plants it in someone else's. For a while, this feels like relief."
      ],
      twists: [
        {
          title: "The Inventory",
          text: "The love arrives first as attention. Then as inventory: your hours, your passwords, your friends, the way you chew. You asked to be known. You did not ask to be catalogued."
        },
        {
          title: "The Exact Amount",
          text: "They love you exactly as much as you asked for. No more, no less. On the days you need more, you will have to ask the willow. The willow is busy."
        },
        {
          title: "The Seam",
          text: "Everyone else can see the seam. At dinner your friends watch the two of you like a photograph that has been folded and smoothed flat. They stop inviting you."
        },
        {
          title: "The Honest Answer",
          text: "One night you will ask, \"Do you love me, or did I wish it?\" They will answer honestly. That will be the last honest thing between you."
        }
      ],
      prices: [
        "The willow's price: you will never be loved by accident again.",
        "You will get the love. The doubt comes free and stays longer."
      ]
    },

    money: {
      label: "MONEY",
      cost: "COMPOUNDING",
      keywords: [
        /\bmoney\b/i, /\brich\b/i, /\bwealth(y)?\b/i, /\bmillion/i, /\bbillion/i,
        /\blottery\b/i, /\bjackpot\b/i, /\bdebt\b/i, /\bpay off\b/i, /\bafford\b/i,
        /\bcash\b/i, /\bgold\b/i, /\bsalary\b/i, /\bfinance/i, /\binvest/i,
        /\bmansion\b/i, /\bexpensive\b/i, /\bpoor\b/i, /\bfortune\b/i,
        /\bincome\b/i, /\brent\b/i, /\bbroke\b/i
      ],
      strong: [/\bmoney\b/i, /\brich\b/i, /\blottery\b/i, /\bmillion/i, /\bbillion/i, /\bpay off\b/i],
      granted: [
        "The willow does not print money. It rearranges. By morning, the world has agreed that you are rich; nobody remembers agreeing.",
        "Abundance arrives quietly, in increments, like water finding a foundation. You notice the ceiling first. Then the floor."
      ],
      twists: [
        {
          title: "The Circulation",
          text: "Every note in your pocket was once someone's rent. You will learn to spend quickly, before the faces come back."
        },
        {
          title: "The Appetite",
          text: "You can afford anything now. You cannot afford to be seen wanting anything, so you buy the things you do not want and call it taste."
        },
        {
          title: "The Explanation",
          text: "The people who loved you before will start explaining you to strangers. \"He's different now.\" They are not wrong, but they are not being kind."
        },
        {
          title: "The Wall",
          text: "You will build a wall high enough to keep out need. On the other side, someone you love will stand in the rain, deciding not to knock."
        }
      ],
      prices: [
        "The price is not the money. It is the door you will close to keep it.",
        "You will die rich. The will is one page. The names are all wrong."
      ]
    },

    fame: {
      label: "FAME",
      cost: "EXPOSED",
      keywords: [
        /\bfamous\b/i, /\bfame\b/i, /\bcelebrity\b/i, /\bviral\b/i, /\bfollowers?\b/i,
        /\binstagram\b/i, /\btiktok\b/i, /\bknown\b/i, /\bremembered\b/i, /\blegacy\b/i,
        /\bstar\b/i, /\bspotlight\b/i, /\battention\b/i, /\bfans?\b/i,
        /\binfluencer\b/i, /\btrending\b/i, /\bname in lights\b/i, /\brecognized\b/i
      ],
      strong: [/\bfamous\b/i, /\bfame\b/i, /\bremembered\b/i, /\bviral\b/i, /\bfollowers?\b/i, /\bcelebrity\b/i],
      granted: [
        "The willow gives you an audience. It does not give you a self to perform. That part you will build nightly, out of comments.",
        "By morning your name is in a thousand mouths. None of them are chewing."
      ],
      twists: [
        {
          title: "The Understudy",
          text: "They will love a version of you that you did not create and cannot delete. The real you will begin to dress like it, just to be recognized."
        },
        {
          title: "The Record",
          text: "Your worst day will be the one they screenshot. You will spend years explaining it in a voice that sounds more and more like an apology."
        },
        {
          title: "The Glass House",
          text: "Privacy becomes a rumour. You will eat in bathrooms, cry in cars, and learn to sleep with one eye on the door."
        },
        {
          title: "The Tide",
          text: "When the attention goes, it goes all at once, like a tide that was never yours. The silence will be so complete you can hear your own name being forgotten."
        }
      ],
      prices: [
        "Fame is a loan taken against your future privacy. The willow collects in strangers.",
        "They will remember you. That is not the same as being known."
      ]
    },

    beauty: {
      label: "BEAUTY",
      cost: "SURFACE",
      keywords: [
        /\bbeautiful\b/i, /\bpretty\b/i, /\bhandsome\b/i, /\battractive\b/i, /\bthin\b/i,
        /\bskinny\b/i, /\bbody\b/i, /\bface\b/i, /\bskin\b/i, /\bhair\b/i,
        /\btall(er)?\b/i, /\bheight\b/i, /\byoung(er)?\b/i, /\byouthful\b/i,
        /\bgrey\b/i, /\bgray\b/i, /\bwrinkle/i, /\bugly\b/i, /\bweight\b/i,
        /\bmuscles?\b/i, /\bjawline\b/i, /\blook good\b/i
      ],
      strong: [/\bbeautiful\b/i, /\bhandsome\b/i, /\battractive\b/i, /\bpretty\b/i, /\bthin\b/i, /\bweight\b/i],
      granted: [
        "The willow redraws you. Strangers' eyes catch, then slide away, unsure what they saw. You are beautiful in the way a knife is.",
        "You wake in a face that fits. For one entire morning, nothing in the world is more interesting than your reflection."
      ],
      twists: [
        {
          title: "The Upkeep",
          text: "You will be loved for a surface that requires maintenance. Every hour not spent on it becomes an hour of losing something you cannot name."
        },
        {
          title: "The Decoration",
          text: "People stop listening after the first sentence. Your opinions arrive late, like guests who were only invited to fill a chair."
        },
        {
          title: "The Mirror",
          text: "You begin to suspect the mirror is the only honest witness left. It agrees with everyone. That is how you know it is lying."
        },
        {
          title: "The Old Face",
          text: "One day the light will be wrong, and you will see the old face underneath, waiting patiently, having never left. It will look relieved."
        }
      ],
      prices: [
        "Beauty is a room with a mirror on every wall. The willow charges rent by the hour.",
        "You will be seen. You will not be looked at for long."
      ]
    },

    power: {
      label: "POWER",
      cost: "INHERITED",
      keywords: [
        /\bpower(ful)?\b/i, /\bcontrol\b/i, /\bboss\b/i, /\bruler\b/i, /\bking\b/i,
        /\bqueen\b/i, /\bpresident\b/i, /\bobey\b/i, /\bcommand\b/i, /\bauthority\b/i,
        /\brule\b/i, /\bleader\b/i, /\bfeared\b/i, /\brespect(ed)?\b/i,
        /\bdominance\b/i, /\bthrone\b/i, /\bin charge\b/i
      ],
      strong: [/\bpower\b/i, /\bcontrol\b/i, /\bobey\b/i, /\brule\b/i, /\bpresident\b/i, /\bking\b/i, /\bqueen\b/i],
      granted: [
        "The willow gives you a room where everyone listens. It does not soundproof the room. You will hear every swallow.",
        "Authority settles on your shoulders like a coat cut for a larger man. You wear it well. You wear it constantly."
      ],
      twists: [
        {
          title: "The Yes",
          text: "People obey you before you finish the sentence. You stop finishing sentences. Then you stop having thoughts worth finishing."
        },
        {
          title: "The Silence",
          text: "Every order creates a small silence behind you. You will learn to walk faster than it, and never quite lose it."
        },
        {
          title: "The Flinch",
          text: "You will mistake fear for respect until the day someone flinches at your kindness. Then you will know the difference, and wish you didn't."
        },
        {
          title: "The Throne",
          text: "The throne is comfortable. That is the trap. By the time you stand, your legs will have forgotten any other shape."
        }
      ],
      prices: [
        "Power is a debt paid by everyone who cannot refuse you.",
        "You will be obeyed. You will be alone in a room full of people waiting for you to leave."
      ]
    },

    revenge: {
      label: "REVENGE",
      cost: "CIRCULAR",
      keywords: [
        /\brevenge\b/i, /\bhurt\b/i, /\bsuffer\b/i, /\bpay for\b/i, /\bmake them\b/i,
        /\bregret\b/i, /\bcurse\b/i, /\bruin\b/i, /\bdestroy\b/i, /\bget back at\b/i,
        /\bkarma\b/i, /\bjustice\b/i, /\bpunish\b/i, /\benem(y|ies)\b/i,
        /\bthey deserve\b/i, /\bmake .* pay\b/i
      ],
      strong: [/\brevenge\b/i, /\bget back at\b/i, /\bmake .* pay\b/i, /\bpunish\b/i, /\bcurse\b/i, /\benemy\b/i],
      granted: [
        "The willow grants revenge the way frost grants a garden: evenly, beautifully, and to everything.",
        "It hands you the wound back, sharpened. You will find you are very good at holding it."
      ],
      twists: [
        {
          title: "The Radius",
          text: "The first blow lands exactly where you aimed. The second lands on someone who was only standing nearby. The willow does not apologise; you did not specify."
        },
        {
          title: "The Face",
          text: "You rehearse their face when it happens. When it happens, their face is not the one you rehearsed. It is smaller, older, and tired in a way you recognize."
        },
        {
          title: "The Echo",
          text: "Afterward there is no relief — only the echo of the person you were before you wanted this. They do not come back."
        },
        {
          title: "The Afterward",
          text: "You will get everything you wanted. Then you will spend years trying to become someone who did not want it."
        }
      ],
      prices: [
        "Revenge is a fire you carry to someone else's house. The willow charges you for the walk.",
        "The willow will give you justice. It will not give you back the person who wanted it."
      ]
    },

    death: {
      label: "MORTALITY",
      cost: "UNCLOSED",
      keywords: [
        /\bdie\b/i, /\bdeath\b/i, /\bdead\b/i, /\bkill\b/i, /\bimmortal\b/i,
        /\bresurrect\b/i, /\bbring .* back\b/i, /\bgrief\b/i, /\bfuneral\b/i,
        /\bheaven\b/i, /\bafterlife\b/i, /\blive forever\b/i, /\bmortality\b/i,
        /\bgrave\b/i, /\bghost\b/i, /\bwidow\b/i, /\blost (my|him|her|them)\b/i,
        /\bnever die\b/i, /\bageless\b/i, /\bforever\b/i, /\beternity\b/i,
        /\balive\b/i, /\bdied\b/i, /\bpassed away\b/i, /\bmissing (him|her|them)\b/i
      ],
      strong: [/\bimmortal\b/i, /\blive[sd]? forever\b/i, /\bnever die\b/i, /\bresurrect\b/i, /\bbring .* back\b/i, /\bdead\b/i],
      granted: [
        "The willow makes a hole in the world and refuses to let it close. What you lost will not return; it will simply stop being gone.",
        "You ask for forever. The willow is old enough to find this funny."
      ],
      twists: [
        {
          title: "The Pause",
          text: "They come back wrong in a way only you can see: a pause before your name, a hunger behind the eyes that food does not touch."
        },
        {
          title: "The Last Time",
          text: "You do not age. Neither does the memory of the last time you were held without knowing it was the last."
        },
        {
          title: "The Appointment",
          text: "Everyone you love begins to look like an appointment you are dreading. You start leaving rooms before they enter."
        },
        {
          title: "The Room",
          text: "Forever is not a length of time. It is a room with no windows and one door, and the door only opens inward."
        }
      ],
      prices: [
        "Immortality is a house with no exit and every room full of people you have outlived.",
        "You will not die. The willow never said you would keep living."
      ]
    },

    time: {
      label: "TIME",
      cost: "BORROWED",
      keywords: [
        /\btime\b/i, /\bpast\b/i, /\bfuture\b/i, /\bgo back\b/i, /\bback to\b/i,
        /\brewind\b/i, /\bundo\b/i, /\b(never|not) again\b/i, /\byounger\b/i,
        /\byouth\b/i, /\b(old|older|age|aging)\b/i, /\bslow (down|time)\b/i,
        /\bfast forward\b/i, /\bredo\b/i, /\byesterday\b/i, /\bmemories\b/i,
        /\bsecond chance\b/i, /\bstart again\b/i
      ],
      strong: [/\bmore time\b/i, /\bgo back\b/i, /\brewind\b/i, /\bundo\b/i, /\byounger\b/i, /\btime travel\b/i, /\bsecond chance\b/i, /\b(stop|freeze|control) time\b/i],
      granted: [
        "The willow folds time like a letter. It does not care which crease you wanted; it only cares that the paper now has a memory.",
        "You get your hour back. It arrives with interest."
      ],
      twists: [
        {
          title: "The Set",
          text: "The past returns without its context. You get the day, not the person; the light, not the reason you were happy in it."
        },
        {
          title: "The Loan",
          text: "Every minute you take from before is taken from after. You will not notice until someone younger than you calls you by your old nickname."
        },
        {
          title: "The Edit",
          text: "You keep going back to fix it. Each return makes the original smaller, until the day you can no longer remember what you were trying to save."
        },
        {
          title: "The Doorway",
          text: "Time does not rewind. It only lets you watch. You will stand in the doorway of the worst hour of your life, unable to touch anything, forever invited."
        }
      ],
      prices: [
        "The past is not a place. It is a bill that comes due in the present.",
        "You will get more time. The willow will decide whose."
      ]
    },

    health: {
      label: "HEALTH",
      cost: "DEFERRED",
      keywords: [
        /\bhealth(y)?\b/i, /\bheal\b/i, /\bcure\b/i, /\bpain\b/i, /\bsick\b/i,
        /\billness\b/i, /\bdisease\b/i, /\bcancer\b/i, /\bhospital\b/i, /\bdoctor\b/i,
        /\bmedicine\b/i, /\bsleep\b/i, /\binsomnia\b/i, /\banxiety\b/i,
        /\bdepress/i, /\bmental\b/i, /\bsober\b/i, /\baddict/i, /\binjur/i,
        /\bdisabled\b/i, /\bchronic\b/i, /\bdiagnos/i, /\bbody\b/i
      ],
      strong: [/\bheal\b/i, /\bcure\b/i, /\bcancer\b/i, /\binsomnia\b/i, /\bsick\b/i, /\bdisease\b/i, /\bpain\b/i, /\bhealth\b/i],
      granted: [
        "The willow closes the wound. It does not ask what the wound was for.",
        "Your body stops arguing. For the first time in years, it is quiet in there."
      ],
      twists: [
        {
          title: "The Numb",
          text: "The pain leaves, but the reason for it stays, invisible, walking beside you. You will only notice when something small breaks."
        },
        {
          title: "The Invitation",
          text: "You feel invincible for exactly as long as it takes to stop being careful. The willow does not grant a second healing."
        },
        {
          title: "The Care",
          text: "Everyone who worried about you loses the thing that made them gentle. They love you, but they no longer know how to show it."
        },
        {
          title: "The Long Cure",
          text: "You will live long enough to watch the cure become the thing that kills you, slowly, in a language of side effects."
        }
      ],
      prices: [
        "Health is not a gift. It is a loan from every version of you who did not get it.",
        "You will be whole. The willow keeps the part of you that knew how to be careful."
      ]
    },

    family: {
      label: "FAMILY",
      cost: "INHERITED",
      keywords: [
        /\bfamily\b/i, /\bmother\b/i, /\bmom\b/i, /\bfather\b/i, /\bdad\b/i,
        /\bparents?\b/i, /\bchild(ren)?\b/i, /\bson\b/i, /\bdaughter\b/i,
        /\bbaby\b/i, /\bpregnan/i, /\bsibling/i, /\bbrother\b/i, /\bsister\b/i,
        /\bgrand(mother|father|ma|pa)\b/i, /\brelative/i, /\bhome\b/i,
        /\bwife\b/i, /\bhusband\b/i, /\bkid\b/i
      ],
      strong: [/\bchild\b/i, /\bbaby\b/i, /\bpregnan/i, /\bmother\b/i, /\bfather\b/i, /\bfamily\b/i, /\bson\b/i, /\bdaughter\b/i],
      granted: [
        "The willow gives you the family you asked for. It gives it to you first as a photograph, then as a debt.",
        "A child, a parent, a person returned: the willow uses the same door for all three."
      ],
      twists: [
        {
          title: "The Close Enough",
          text: "They love you the way you always wanted. It is so close to the real thing that you stop noticing the difference, and then you stop noticing anything."
        },
        {
          title: "The Holder",
          text: "You become the person who holds everyone. Nobody asks who holds you. The willow does not provide a second pair of arms."
        },
        {
          title: "The Inheritance",
          text: "The family you build will inherit the family you came from, no matter how far you move. It travels in the blood, in the pauses, in the way you say \"fine\"."
        },
        {
          title: "The Turning",
          text: "You get the child you wished for. They grow up wanting a parent who is not you, and you will understand completely."
        }
      ],
      prices: [
        "Family is a wish the willow grants by making you responsible for it.",
        "You will not be alone. You will be needed. The willow considers these different."
      ]
    },

    memory: {
      label: "MEMORY",
      cost: "ERASED",
      keywords: [
        /\bforget\b/i, /\bmemory\b/i, /\bmemories\b/i, /\berase\b/i, /\bwipe\b/i,
        /\bamnesia\b/i, /\bunremember\b/i, /\bblock (it|him|her|them) out\b/i,
        /\bstop remembering\b/i, /\bforgetful\b/i
      ],
      strong: [/\bforget\b/i, /\berase\b/i, /\bwipe\b/i, /\bmemory\b/i, /\bmemories\b/i, /\bamnesia\b/i],
      granted: [
        "The willow takes the memory out through the ear, like a thread. It is cleaner than you expected. The hole is not.",
        "It gives you the forgetting you asked for, in small doses, so you will not notice the shape of the absence."
      ],
      twists: [
        {
          title: "The Body's Copy",
          text: "The memory goes. The body keeps its own copy — in the shoulders, in the way you flinch at a certain song, in the pause before you say a name you no longer know."
        },
        {
          title: "The Same Room",
          text: "You forget the worst of it, then the best of it, because they were stored in the same room. You will not know what you lost, only that a door is missing."
        },
        {
          title: "The Rumour",
          text: "People keep referring to a version of you who remembers. You will learn to nod. It is exhausting, being a rumour of yourself."
        },
        {
          title: "The Stranger",
          text: "One day someone will tell you what happened, kindly, and you will grieve a stranger with your whole body. The willow considers this a successful grant."
        }
      ],
      prices: [
        "Forgetting is a door. The willow charges you for the room behind it.",
        "You will get peace. It will not be yours."
      ]
    },

    knowledge: {
      label: "TRUTH",
      cost: "IRREVERSIBLE",
      keywords: [
        /\bknow\b/i, /\btruth\b/i, /\bsmart(er)?\b/i, /\bgenius\b/i, /\bintelligen/i,
        /\blearn\b/i, /\bunderstand\b/i, /\banswers?\b/i, /\bsecrets?\b/i,
        /\bmind read/i, /\btelepath/i, /\bremember everything\b/i, /\bwise\b/i,
        /\bwisdom\b/i, /\bproof\b/i, /\bwhat really happened\b/i
      ],
      strong: [/\btruth\b/i, /\bgenius\b/i, /\btelepath/i, /\bmind read/i, /\bknow everything\b/i, /\ball the answers\b/i, /\bsecret\b/i],
      granted: [
        "The willow opens the book. It does not let you close it.",
        "You wanted the truth. The willow gives it to you in the original language, without subtitles."
      ],
      twists: [
        {
          title: "The Lights",
          text: "You learn what people think of you. It arrives all at once, like a room with the lights suddenly on."
        },
        {
          title: "The Rehearsal",
          text: "Knowing the future does not let you change it. It only lets you rehearse the grief."
        },
        {
          title: "The Price Tag",
          text: "You can no longer be lied to, which means you can no longer be comforted. Every kindness now arrives with its exact price tag."
        },
        {
          title: "The Right",
          text: "The answers are correct. The questions were never yours. You will spend your life being right about things you did not care about."
        }
      ],
      prices: [
        "Knowledge is a door. The willow charges you for what is on the other side.",
        "You will understand everything. Understanding is not the same as being able to bear it."
      ]
    },

    freedom: {
      label: "FREEDOM",
      cost: "UNMOORED",
      keywords: [
        /\bfree\b/i, /\bfreedom\b/i, /\bescape\b/i, /\bleave\b/i, /\brun away\b/i,
        /\bdisappear\b/i, /\bpeace\b/i, /\bquiet\b/i, /\balone\b/i, /\bsolitude\b/i,
        /\bstart over\b/i, /\brestart\b/i, /\bnew life\b/i, /\bcage\b/i,
        /\btrapped\b/i, /\bmove away\b/i, /\bgo home\b/i, /\bhome\b/i
      ],
      strong: [/\bfreedom\b/i, /\bescape\b/i, /\brun away\b/i, /\bdisappear\b/i, /\bstart over\b/i, /\bnew life\b/i, /\bgo home\b/i],
      granted: [
        "The willow opens every door at once. You will spend a long time learning which one was a wall.",
        "You are free. The first thing you notice is how much of you was built to fit the cage."
      ],
      twists: [
        {
          title: "The Luggage",
          text: "You leave. The thing you were running from is in your luggage, folded neatly between your shirts."
        },
        {
          title: "The Hands",
          text: "No one holds you anymore. You did not realize \"no one\" would include the people who loved you."
        },
        {
          title: "The Fall",
          text: "Freedom has no walls, which means it has no edges, which means you can fall in any direction and never land."
        },
        {
          title: "The Leaving",
          text: "You become the person who leaves. It is a full-time job. You will be very good at it, and very tired."
        }
      ],
      prices: [
        "Freedom is a house with no address. The willow will not forward your mail.",
        "You will escape. The willow will make sure you remember what you escaped from."
      ]
    },

    luck: {
      label: "LUCK",
      cost: "BORROWED",
      keywords: [
        /\bluck(y)?\b/i, /\bfortunate\b/i, /\bwin\b/i, /\bwinning\b/i, /\bnever lose\b/i,
        /\beverything go\b/i, /\bperfect\b/i, /\bmiracle\b/i, /\bblessed\b/i,
        /\bfate\b/i, /\bdestiny\b/i, /\bgamble\b/i, /\bbet\b/i, /\bjackpot\b/i,
        /\bgood things\b/i, /\bwish me luck\b/i
      ],
      strong: [/\blucky\b/i, /\bluck\b/i, /\bnever lose\b/i, /\bwin the\b/i, /\bjackpot\b/i, /\bmiracle\b/i],
      granted: [
        "The willow tilts the world a few degrees in your favour. It does not tell you which way the water will run.",
        "You will win. Not always, but often enough to stop being careful."
      ],
      twists: [
        {
          title: "The Roll",
          text: "Luck is a muscle. The more you use it, the less you notice the people it rolls over."
        },
        {
          title: "The Gap",
          text: "You stop preparing. Why would you? The willow fills the gap. The gap gets wider, and one day the willow is busy."
        },
        {
          title: "The Someone",
          text: "Every win takes something from someone who never met you. You will hear about it eventually, in a sentence that begins \"Did you hear about...\""
        },
        {
          title: "The Two Sides",
          text: "The coin lands your way so often that you forget it has two sides. Then one day it doesn't. You will not know how to lose."
        }
      ],
      prices: [
        "Luck is borrowed from everyone who did not get any today.",
        "You will win the thing you wanted. You will lose the habit of trying."
      ]
    },

    career: {
      label: "AMBITION",
      cost: "DEFERRED",
      keywords: [
        /\bjob\b/i, /\bcareer\b/i, /\bwork\b/i, /\bpromotion\b/i, /\bbusiness\b/i,
        /\bstartup\b/i, /\bsuccess(ful)?\b/i, /\bexam\b/i, /\btest\b/i, /\bgrades?\b/i,
        /\bcollege\b/i, /\buniversity\b/i, /\bschool\b/i, /\badmission\b/i,
        /\binterview\b/i, /\bhired\b/i, /\bfired\b/i, /\bdream job\b/i,
        /\bcompany\b/i, /\bprofession/i
      ],
      strong: [/\bpromotion\b/i, /\bdream job\b/i, /\bcareer\b/i, /\bsuccessful\b/i, /\bexam\b/i, /\bgrades?\b/i, /\bstartup\b/i],
      granted: [
        "The willow promotes you. It does not give you back the years of your life the promotion is made of.",
        "The work finds you. It arrives at three in the morning and stays for breakfast."
      ],
      twists: [
        {
          title: "The Title",
          text: "You get the title. The title gets the rest of you: evenings, friendships, the soft animal of your body."
        },
        {
          title: "The Smile",
          text: "Your success is real, which makes it impossible to complain about. You will smile through the exhaustion and call it gratitude."
        },
        {
          title: "The Rungs",
          text: "The people who helped you up the ladder will become rungs. You will not notice until you look down."
        },
        {
          title: "The Top",
          text: "You reach the top and find a smaller room than you imagined, with your name on the door and nobody inside."
        }
      ],
      prices: [
        "Success is a loan taken against the person you were before you wanted it.",
        "You will be indispensable. The willow knows exactly how heavy that word can be."
      ]
    },

    superpower: {
      label: "POWER",
      cost: "VISIBLE",
      keywords: [
        /\bfly(ing)?\b/i, /\binvisib/i, /\bteleport/i, /\bstrength\b/i, /\bsuperpower/i,
        /\bpowers?\b/i, /\bmagic\b/i, /\bwizard\b/i, /\bwitch\b/i, /\bwings\b/i,
        /\bshapeshift/i, /\bfreeze time\b/i, /\bcontrol time\b/i, /\bimmortal\b/i,
        /\bsuperhuman\b/i, /\bmind control\b/i
      ],
      strong: [/\bfly\b/i, /\binvisib/i, /\bteleport/i, /\bsuperpower/i, /\bsuperhuman\b/i, /\bshapeshift/i, /\bmagic\b/i],
      granted: [
        "The willow grants the impossible. It has no idea what to do with the ordinary, so it improvises.",
        "You wake with the power. It fits like a second skeleton, and it is already growing."
      ],
      twists: [
        {
          title: "The Water",
          text: "The power works perfectly. The world adjusts around it in ways you did not plan, the way a river adjusts to a dam: by finding every other way down."
        },
        {
          title: "The Third Use",
          text: "You use it once to help. Then once to be admired. Then once to be feared. There is no fourth use that is not one of the first three."
        },
        {
          title: "The Rumour",
          text: "You become a rumour in your own life. People speak of you in the third person while you are standing in the room."
        },
        {
          title: "The Visible",
          text: "The power does not make you special. It makes you visible. The willow considers this the same thing."
        }
      ],
      prices: [
        "A power is a doorway. The willow charges you for the shape of the house on the other side.",
        "You will be extraordinary. The willow will not let you be ordinary again."
      ]
    },

    world: {
      label: "THE WORLD",
      cost: "DEFERRED",
      keywords: [
        /\bworld peace\b/i, /\bpeace on earth\b/i, /\bend (war|hunger|poverty|suffering)\b/i,
        /\bsave the world\b/i, /\bclimate\b/i, /\benvironment\b/i, /\bhumanity\b/i,
        /\beveryone\b/i, /\ball people\b/i, /\bwar\b/i, /\bpoverty\b/i,
        /\bgovernment\b/i, /\bsociety\b/i, /\bcure cancer\b/i, /\bthe world\b/i
      ],
      strong: [/\bworld peace\b/i, /\bpeace on earth\b/i, /\bend (war|hunger|poverty)\b/i, /\bsave the world\b/i, /\bclimate\b/i, /\bhumanity\b/i],
      granted: [
        "The willow ends the war. It does not end the reasons. It simply puts them somewhere out of sight.",
        "For one week the world is quiet. People keep touching their ears, as if they have forgotten what silence sounds like."
      ],
      twists: [
        {
          title: "The Homecoming",
          text: "Peace arrives as exhaustion. The soldiers go home and find they no longer know how to live beside their neighbours, who also went home changed."
        },
        {
          title: "The Smaller Enemy",
          text: "Without an enemy, the world looks for a smaller one. It finds one in a room with you in it."
        },
        {
          title: "The Glass",
          text: "The silence is perfect, and perfectly fragile. Everyone is being careful in a way that feels like holding a glass that is already cracked."
        },
        {
          title: "The Thanks",
          text: "You will be thanked by everyone. None of them will help you carry what it costs to keep being thanked."
        }
      ],
      prices: [
        "Peace is a debt paid by everyone who was not in the room when it was wished.",
        "You will get quiet. The willow will make sure you know what was buried to make it."
      ]
    },

    belonging: {
      label: "BELONGING",
      cost: "CONDITIONAL",
      keywords: [
        /\bfriends?\b/i, /\blonely\b/i, /\bloneliness\b/i, /\bfit in\b/i, /\bbelong\b/i,
        /\bpopular\b/i, /\baccepted\b/i, /\bcommunity\b/i, /\bsocial\b/i,
        /\bincluded\b/i, /\brejected\b/i, /\bbullied\b/i, /\bnormal\b/i,
        /\bpeople like me\b/i, /\bgroup\b/i
      ],
      strong: [/\blonely\b/i, /\bloneliness\b/i, /\bfit in\b/i, /\bbelong\b/i, /\bpopular\b/i, /\bfriends?\b/i, /\bsocial\b/i],
      granted: [
        "The willow builds you a table. Everyone has a seat. Everyone is smiling. You are the only one who can hear the wood creaking.",
        "You belong now. It is a warm room, and the door only locks from the outside."
      ],
      twists: [
        {
          title: "The Easy One",
          text: "They accept you. They accept a version of you that is easy to accept, and you begin to feed it at the expense of the other one."
        },
        {
          title: "The Invitation",
          text: "You are invited everywhere. You start saying yes to invitations you do not want, to prove the invitation is real."
        },
        {
          title: "The Quiet",
          text: "You finally stop being lonely. It turns out loneliness was also the place where you could hear yourself think."
        },
        {
          title: "The Disagreement",
          text: "They love you as one of them. One day you will disagree with them, and you will find out what \"one of them\" was always worth."
        }
      ],
      prices: [
        "Belonging is a room you pay for by forgetting the shape of your own name.",
        "You will be included. The willow will not say in what."
      ]
    },

    joy: {
      label: "HAPPINESS",
      cost: "CONDITIONAL",
      keywords: [
        /\bhappy\b/i, /\bhappiness\b/i, /\bjoy\b/i, /\bcontent(ment)?\b/i,
        /\bfulfil/i, /\bmeaning\b/i, /\bpurpose\b/i, /\bnot sad\b/i,
        /\bpeace of mind\b/i
      ],
      strong: [/\bbe happy\b/i, /\bhappiness\b/i, /\bjoy\b/i, /\bcontent(ment)?\b/i, /\bpeace of mind\b/i],
      granted: [
        "The willow gives you happiness the way a lamp gives you a room: by making everything in it visible, including the corners you had been avoiding.",
        "It reaches into you and turns the volume down on the old grief. You did not know grief was holding the furniture together."
      ],
      twists: [
        {
          title: "The Meter",
          text: "The happiness is real, and it is borrowed. You can feel it being metered — a little less on Mondays, a little more when you perform it for others."
        },
        {
          title: "The Guard",
          text: "You become afraid of the day it stops. You spend the good hours guarding them, which is a way of not being in them."
        },
        {
          title: "The Coat",
          text: "People prefer you happy. You learn to wear it past the point where it fits, like a coat that is too warm for the season."
        },
        {
          title: "The Ordinary",
          text: "One ordinary afternoon you will be happy for no reason at all. You will not trust it. The willow considers this its finest work."
        }
      ],
      prices: [
        "Happiness is not a state. It is a subscription, and the willow owns the account.",
        "You will be happy. The willow will decide how much of you gets to come along."
      ]
    },

    pets: {
      label: "COMPANIONSHIP",
      cost: "MORTAL",
      keywords: [
        /\bdog\b/i, /\bcat\b/i, /\bpuppy\b/i, /\bkitten\b/i, /\bpet\b/i,
        /\banimal\b/i, /\bcompanion\b/i, /\bhorse\b/i, /\bbird\b/i
      ],
      strong: [/\bdog\b/i, /\bcat\b/i, /\bpuppy\b/i, /\bkitten\b/i, /\bpet\b/i],
      granted: [
        "The willow gives you a companion. It chooses one that will love you without conditions, which is the problem.",
        "Something small and warm arrives in your life. It does not know what you wished for. It only knows the sound of your keys."
      ],
      twists: [
        {
          title: "The Wait",
          text: "The animal loves you completely. It has no other language. You will leave it for a weekend and come back to a creature that has been holding its breath."
        },
        {
          title: "The Contract",
          text: "You will outlive it. That is the contract. The willow does not mention this until the third year, when the first grey hair appears on its chin."
        },
        {
          title: "The Room",
          text: "You start arranging your life around its needs. Friends notice. You call it love. It is love. It is also a room getting smaller."
        },
        {
          title: "The Look",
          text: "One day it looks at you with eyes that know you are the one who wished for this. It does not blink. You will not be able to explain the feeling."
        }
      ],
      prices: [
        "A pet is a small forever you will have to survive.",
        "You will be loved without reservation. You will learn what that costs when it ends."
      ]
    },

    default: {
      label: "THE UNNAMED",
      cost: "UNTRANSLATED",
      keywords: [],
      strong: [],
      granted: [
        "The willow listens. It understands less than you think and more than you would like.",
        "Your wish does not have a name in any language the willow uses. It will be granted as an approximation, and approximations have teeth."
      ],
      twists: [
        {
          title: "The Shape",
          text: "It gives you the shape of the wish: the gestures, the vocabulary, the waiting. The substance is on backorder."
        },
        {
          title: "The Vessel",
          text: "What you asked for arrives in a form that requires you to become someone else to hold it. The willow considers this a feature."
        },
        {
          title: "The Warning",
          text: "Everyone who hears about it will tell you to be careful what you wish for. You will laugh. You will stop laughing around the same time they stop calling."
        },
        {
          title: "The Floorboards",
          text: "The wish is granted. Somewhere, a version of you begins to live it, and you can feel them through the floorboards of your life."
        }
      ],
      prices: [
        "The willow does not grant wishes. It rearranges causes. You are one of the causes.",
        "You will get what you asked for. The willow will get what it came for."
      ]
    }

  });

  /* ---------------- the opposite ----------------
     Every wish is answered with its exact inverse. These lines name the
     thing that was wanted, then take it away in the most literal way
     the willow can arrange. Two per domain, plus a fallback set. */

  const INVERSIONS = {
    love: [
      "You asked to be loved. So the willow removes the wanting: everyone will be kind to you, and no one will need you, and you will spend years pressing the place where longing used to be.",
      "You asked for someone to choose you. The willow chooses no one. You will be admired, thanked and left, and you will mistake the leaving for a kind of freedom.",
      "You asked to be held. It grants the opposite: a life so spacious that your arms forget their shape, and every room you enter is already full of people who do not turn."
    ],
    money: [
      "You asked for enough. It grants the opposite of enough: you will never want for anything again, and want itself will leave you, and you will not know what to do with your hands.",
      "You asked to be rich. It makes you poor in the only currency it cannot print: every door will open, and no one will be waiting behind any of them.",
      "You asked for money. It grants the absence of need — a flat, clean, well-lit life in which nothing is at stake and no one ever asks you for anything."
    ],
    fame: [
      "You asked to be remembered. It grants the opposite: you will be forgotten while still in the room, and you will learn to introduce yourself twice.",
      "You asked for an audience. The willow empties the theatre and leaves the lights on, and you will perform for years before you notice.",
      "You asked to matter to strangers. It makes you matter to no one, intimately and completely, and calls that privacy."
    ],
    beauty: [
      "You asked to be seen. It grants invisibility: people will look through you kindly, and you will become expert at the sound of your own name not being said.",
      "You asked for a face that stops the room. The room will not stop. It will pass through you, and you will learn that being unnoticed is a kind of weather.",
      "You asked to be beautiful. It gives you the opposite: a body no one desires, and a mind that finally has time to become something else."
    ],
    power: [
      "You asked to be obeyed. It grants disobedience: no one will do what you say, and you will discover how much of you was only ever a command.",
      "You asked for control. It gives you a life in which nothing needs controlling, and you will go looking for a lever until your hands are empty.",
      "You asked to be feared. It makes you harmless. You will be loved easily and taken lightly, and no one will ever lower their voice for you."
    ],
    revenge: [
      "You asked them to suffer. It grants mercy instead: they will be forgiven, prosper, and forget you, and you will carry the whole weight of the wish alone.",
      "You asked for justice. It gives you the opposite: a world in which nothing is owed to you, and the wound closes without ever being answered.",
      "You asked to make them pay. The willow pays them. You will watch them become happy, and you will be the only one still counting."
    ],
    death: [
      "You asked for forever. It grants an ending: everything you love will complete itself, and you will be there for all of it, awake.",
      "You asked to never die. The willow gives you a death so ordinary it arrives on a Tuesday, and the world closes over you without a sound.",
      "You asked to bring them back. It lets them stay gone, and gives you the opposite of grief: a clean, quiet absence that never visits you."
    ],
    time: [
      "You asked for more time. It grants the opposite: every hour will arrive already spent, and you will live in the aftertaste of a day you cannot enter.",
      "You asked to go back. It gives you only forward, faster, with no door behind you and no version of the past that will take your call.",
      "You asked to undo it. The willow makes it permanent, and gives you a memory with no seam, so you cannot even find the place to press."
    ],
    health: [
      "You asked to be well. It grants the opposite of illness and the opposite of healing: a body that never complains and never once feels like yours.",
      "You asked for the pain to stop. It stops, and takes the warning with it; you will not notice what is breaking until it is already gone.",
      "You asked to be cured. The willow makes you unremarkable: no one will worry about you again, and you will miss the worrying more than the pain."
    ],
    family: [
      "You asked not to be alone. It grants solitude: a full house, a table set for many, and no one who will ever ask how you are.",
      "You asked for the family you wanted. It gives you strangers who share your name, and a home that is only a building with your things in it.",
      "You asked for a child. The willow gives you the opposite: a life with no one to pass it to, and all the time in the world to notice."
    ],
    memory: [
      "You asked to forget. It grants total recall: every kind word and every crueller one, in order, with dates, forever.",
      "You asked to lose the memory. It gives you the opposite: a past so clear it crowds out the present, and you will live in rooms that no longer exist.",
      "You asked to be free of it. The willow makes it the only thing you can see, and builds your whole life around a door you cannot close."
    ],
    knowledge: [
      "You asked to know. It grants the opposite: a life of comfortable not-knowing, in which every answer arrives just after you stop needing it.",
      "You asked for the truth. It gives you doubt, endlessly renewable, and you will be wrong in ways that feel exactly like certainty.",
      "You asked to understand. The willow makes you simple and content, and you will never once suspect what was taken."
    ],
    freedom: [
      "You asked to be free. It grants belonging: a warm room, a hundred small obligations, and a key you will never need.",
      "You asked to escape. It gives you nowhere to go and no one to escape from, and you will spend years looking for the wall.",
      "You asked for no cage. The willow gives you open sky, and you will discover that freedom is only another word for falling."
    ],
    luck: [
      "You asked for luck. It grants fairness: everything you get, you will earn exactly, and nothing will ever arrive unasked.",
      "You asked to win. It gives you the opposite: a life in which no one keeps score, and every victory dissolves before you can hold it.",
      "You asked for things to go your way. The willow makes every way equally possible, and you will stand at the centre of your life unable to choose."
    ],
    career: [
      "You asked to succeed. It grants obscurity: work that matters to no one, done well, in a room with no window, for years.",
      "You asked for the promotion. It gives you the opposite: no one expects anything of you again, and you will miss the weight.",
      "You asked to be indispensable. The willow makes you replaceable, and you will watch yourself be replaced by someone kinder and cheaper."
    ],
    superpower: [
      "You asked to be extraordinary. It grants the opposite: a life so ordinary that nothing you do leaves a mark, and no one will ever ask you to save them.",
      "You asked for power. It gives you invisibility, and you will learn that being unseen is not the same as being safe.",
      "You asked to fly. The willow keeps you on the ground, and gives you a body that will never fail you in a way anyone notices."
    ],
    world: [
      "You asked to save the world. It grants the opposite: the world saves itself, and you are not in the version it saves.",
      "You asked for peace. The willow gives you a quiet so complete that no one needs to be kind, and you will miss the argument.",
      "You asked to end suffering. It ends the people who suffer, gently, in their sleep, and calls it mercy."
    ],
    belonging: [
      "You asked to belong. It grants solitude: a seat at every table and no one who notices when you leave it.",
      "You asked for friends. The willow gives you a crowd that knows your name and nothing else, and you will be lonely in the exact shape of your wish.",
      "You asked to fit in. It makes you shapeless, and you will fit everywhere and be held nowhere."
    ],
    joy: [
      "You asked to be happy. It grants the opposite: nothing will hurt you again, and nothing will please you either, and you will call the flatness peace.",
      "You asked for joy. The willow removes the grief, and the furniture of your life comes apart quietly, and you do not have the words to miss it.",
      "You asked not to be sad. It gives you a life with no weather, and you will spend years looking for a window."
    ],
    pets: [
      "You asked for a companion. It grants the opposite: no animal will ever choose you, and you will be loved only by things that cannot stay.",
      "You asked to be loved without conditions. The willow gives you a house with no heartbeat in it, and all the quiet you thought you wanted.",
      "You asked for something small to take care of. It gives you nothing to take care of, and you will learn how heavy an empty hand is."
    ],
    default: [
      "You asked for the thing. The willow grants its opposite, precisely, and calls the difference a translation error.",
      "You asked to have. It grants the absence of having, and gives you a life in which the shape of the want is all that remains.",
      "You asked. It heard the opposite in your voice, and it has already begun."
    ]
  };

  Object.keys(INVERSIONS).forEach(function (id) {
    if (D[id]) D[id].inversions = INVERSIONS[id];
  });

  window.WISH_DATA.inversions = [
    "You asked for the thing. The willow grants its absence, then teaches you to miss it in a language you did not know you spoke.",
    "You asked to be given something. It gives you the hollow shape of it, and the shape is exactly your size.",
    "You asked for more. The willow makes you the kind of person who no longer notices when there is less.",
    "You asked it to change your life. It removes the life, and leaves the change standing in the room.",
    "You asked for the opposite of what you fear. The willow grants the fear, and takes away the thing that made it bearable."
  ];

  /* ---------------- shared prose ---------------- */

  window.WISH_DATA.openers = [
    "The branch gives. It does not ask what for.",
    "The willow hears you — not the words, the want underneath them.",
    "It considers the request for a long moment, then decides to be generous. Generosity is its most dangerous mood.",
    "Somewhere below the ground, a root changes direction.",
    "The sap moves. The night leans closer to listen.",
    "The willow is old enough to know better. It grants the wish anyway."
  ];

  window.WISH_DATA.codas = [
    "You will get everything you asked for. You will spend the rest of your life learning what you actually asked for.",
    "The wish is not a door. It is a key that grows into a tree inside the lock.",
    "The willow does not punish. It simply refuses to let a thing exist without its shadow.",
    "Somewhere, a version of you who never broke the branch is still walking home. The willow will not let you meet them.",
    "The tree remembers the exact words. It will use them against you kindly, for years.",
    "The cost was never the wish. The cost is the sentence you will build around it to survive it.",
    "It grants the wish the way winter grants spring: by making it inevitable, then making you wait.",
    "There is no refund. There is only the slow interest of having been heard.",
    "You will tell yourself you would have chosen this. The willow will not correct you.",
    "This is how it grants: not by taking the wish away, but by making it true in the only world that can hold it.",
    "Every wish is a small death of the person who made it. The willow is very good at funerals.",
    "It does not grant what you asked for. It grants what you meant. You will learn the difference in installments."
  ];

  window.WISH_DATA.codaTitles = [
    "The Last Turn",
    "The Shape of the Debt",
    "What the Willow Keeps",
    "The Interest",
    "The Root System"
  ];

  window.WISH_DATA.severity = [
    "a hairline fracture",
    "a spreading fault",
    "a compounding debt",
    "a closed loop",
    "a root system"
  ];

  window.WISH_DATA.twinLines = [
    "Two hungers were in your mouth when you spoke. The willow answers the louder one — and bills you for the other.",
    "You asked for two things and called them one. The willow heard both. It is very good at keeping two sets of books.",
    "There is a second wish hiding inside the first. The willow has already found it. It is smaller, and it has teeth.",
    "You wanted one thing and needed another. The willow will give you the thing, then introduce you to the need."
  ];

  window.WISH_DATA.observationRules = [
    { re: /\bnever\b/i, line: "You said \"never.\" The willow has never met a never it couldn't bend." },
    { re: /\bforever\b/i, line: "You said \"forever.\" Forever is a long time to be held to a sentence." },
    { re: /\balways\b/i, line: "You said \"always.\" The willow heard a door being nailed shut." },
    { re: /\bmore\b/i, line: "You asked for more. The willow would like to know: more than what?" },
    { re: /\bjust\b/i, line: "You said \"just.\" Nothing that follows \"just\" has ever stayed small." },
    { re: /\bonly\b/i, line: "You said \"only.\" The willow charges extra for limitations." },
    { re: /\bplease\b/i, line: "You said \"please.\" The willow is not moved by manners, only by appetite." },
    { re: /\bhappy\b/i, line: "You used the word \"happy.\" The willow will need to define it, and its definitions are structural." },
    { re: /\bagain\b/i, line: "You said \"again.\" The willow remembers the first time." },
    { re: /\bforget\b/i, line: "You asked to forget. The willow can remove the memory; it cannot remove the shape the memory left." },
    { re: /\bnormal\b/i, line: "You wished to be normal. The willow would like to know whose normal." },
    { re: /\bdeserve\b/i, line: "You used the word \"deserve.\" The willow does not deal in fairness. It deals in weight." },
    { re: /\bmaybe\b|\bi guess\b/i, line: "You hedged. The willow will fill the silence with something confident." },
    { re: /\bany(thing|one)\b/i, line: "You left the door open with \"anything.\" The willow has carried something in." },
    { re: /\bbetter than\b/i, line: "You compared. The willow will make sure someone else is always the measure." },
    { re: /\bnot\b/i, line: "You told it what you did not want. The willow only heard the thing you named." }
  ];

  window.WISH_DATA.fallbackObservations = [
    "You said it plainly. The willow prefers a wish it can hold by the throat.",
    "You kept it short. Short wishes leave room for the roots.",
    "You spoke in the present tense. The willow heard a door opening.",
    "There was a pause before you wrote it. The willow counted it.",
    "You did not name a price. The willow always names one.",
    "You wrote it down. Spoken wishes fade; written ones can be quoted.",
    "You used your own words. The willow will use them later, out of context."
  ];

  window.WISH_DATA.tags = [
    "COMPOUNDING",
    "IRREVERSIBLE",
    "INHERITED",
    "PATIENT",
    "ROOT-BOUND",
    "UNREFUNDABLE"
  ];

})();

