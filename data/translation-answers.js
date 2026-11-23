// Accepted English translations of the Level 1 sentences in chapters 1-21, for the Translation
// page's "Check Translation" button. Level 2 has no entry here and stays "check your own".
// Chapters 1-10 were written from the teacher-reviewed answer lists (a review doc, 2026-10-28); chapters 11-21 (2026-11-17)
// follow the same decisions. s169-s209 (2026-11-23) are the sentences added so that every chapter from 2 on has a verb in
// each person and number; they follow the same decisions too (a 2nd person plural needs "you all" or y'all). Edit this file directly to add or change an answer.
//
// Each sentence has one or more patterns:
//   [a | b | c]   exactly one of the choices
//   (word)        may be left out;   (a | b)   none or one of the choices
// A pattern is compared with the student's text after both are cleaned up (js/translation-match.js):
// capitals, punctuation, macrons and hyphens are ignored, contractions are expanded, and a / an / the all
// count as "the". An article is therefore required where a pattern has one and optional where it has (the).

export const ANSWERS = {
  s1: [
    "The farmer [loves | is loving | does love] the [land | earth | ground | soil].",
  ],
  s2: [
    "The sailor [loves | is loving | does love] the daughter.",
  ],
  s3: [
    "The farmer [takes care of | is taking care of | does take care of | cares for | is caring for | does care for | heals | is healing | does heal | looks after | is looking after | does look after | tends | is tending | does tend] the [land | earth | ground | soil].",
  ],
  s4: [
    "The sailor [loves | is loving | does love] (the) water.",
  ],
  s5: [
    "The farmer [takes care of | is taking care of | does take care of | cares for | is caring for | does care for | heals | is healing | does heal | looks after | is looking after | does look after | tends | is tending | does tend] the [land | earth | ground | soil] and (he) [loves | is loving | does love] (the) water.",
  ],
  s6: [
    "The poet [loves | is loving | does love] the girl.",
  ],
  s7: [
    "The she-wolf [takes care of | is taking care of | does take care of | cares for | is caring for | does care for | heals | is healing | does heal | looks after | is looking after | does look after | tends | is tending | does tend] the daughter.",
  ],
  s8: [
    "The sailor [walks | is walking | does walk] well, [and so | so | therefore | and therefore] the poet [loves | is loving | does love] the sailor.",
  ],
  s9: [
    "The girl [tells | is telling | does tell | narrates | is narrating | does narrate | relates | is relating | does relate | recounts | is recounting | does recount] a [story | tale | fable].",
  ],
  s10: [
    "(the) girls [tell | are telling | do tell | narrate | are narrating | do narrate | relate | are relating | do relate | recount | are recounting | do recount] (the) [stories | tales | fables].",
  ],
  s11: [
    "Messenio [sees | is seeing | does see] Menaechmus.",
  ],
  s12: [
    "I [tell | am telling | do tell | narrate | am narrating | do narrate | relate | am relating | do relate | recount | am recounting | do recount] a [story | tale | fable].",
  ],
  s13: [
    "(the) sailors [tell | are telling | do tell | narrate | are narrating | do narrate | relate | are relating | do relate | recount | are recounting | do recount] a [story | tale | fable].",
  ],
  s14: [
    "We [wait for | are waiting for | do wait for | await | are awaiting | do await | expect | are expecting | do expect] the sailor [for a long time | for a long while].",
    "[for a long time | for a long while] we [wait for | are waiting for | do wait for | await | are awaiting | do await | expect | are expecting | do expect] the sailor.",
    "We [wait | are waiting | do wait] a [long time | long while] for the sailor.",
    "We have been [waiting for | awaiting | expecting] the sailor for a long time.",
  ],
  s15: [
    "You [do not see | are not seeing] the farmer.",
  ],
  s16: [
    "The girl [loves | is loving | does love] [the | a | her] [fatherland | country | homeland | native land].",
  ],
  s17: [
    "I [walk | am walking | do walk] [in | on] (the) water.",
  ],
  s18: [
    "Demea [calls | is calling | does call | summons | is summoning | does summon | calls for | is calling for | does call for] [the | a | his] son.",
  ],
  s19: [
    "I [see | am seeing | do see] the field and the [stream | brook].",
  ],
  s20: [
    "The man [walks | is walking | does walk] [on | in] the [road | street | way | path].",
  ],
  s21: [
    "The boy [fears | is fearing | does fear | is afraid of | is scared of] [the | a | his] friend.",
  ],
  s22: [
    "I am [in | on] the field with [the | a | my] friend.",
    "I am with [the | a | my] friend [in | on] the field.",
  ],
  s23: [
    "The son [sees | is seeing | does see] the [stream | brook].",
  ],
  s24: [
    "You are at home.",
  ],
  s25: [
    "The consul [gives | is giving | does give] a [reward | prize | gift] to the man.",
    "The consul [gives | is giving | does give] the man a [reward | prize | gift].",
  ],
  s26: [
    "[he | she | it | s/he | he/she | s/he/it | he/she/it | he or she] [tells | is telling | does tell | narrates | is narrating | does narrate | relates | is relating | does relate | recounts | is recounting | does recount] (the) [stories | tales | fables] to the daughter.",
    "[he | she | it | s/he | he/she | s/he/it | he/she/it | he or she] [tells | is telling | does tell | narrates | is narrating | does narrate | relates | is relating | does relate | recounts | is recounting | does recount] the daughter (the) [stories | tales | fables].",
    "[he | she | it | s/he | he/she | s/he/it | he/she/it | he or she] [tells | is telling | does tell | narrates | is narrating | does narrate | relates | is relating | does relate | recounts | is recounting | does recount] the daughter's [stories | tales | fables].",
  ],
  s27: [
    "We [walk | are walking | do walk] [to | toward | towards | into] the [large | great | important | big] [camp | camps].",
  ],
  s28: [
    "The farmer [gives | is giving | does give] a [reward | prize | gift] to [the | a | his] son.",
    "The farmer [gives | is giving | does give] [the | a | his] son a [reward | prize | gift].",
  ],
  s29: [
    "(the) Roman men [do not fear | are not fearing | are not afraid of | are not scared of] (the) war.",
  ],
  s30: [
    "The [bad | evil | wicked] man [prepares | is preparing | does prepare | designs | is designing | does design] [a trick | trickery | the trickery | deception | the deception | deceit | the deceit].",
  ],
  s31: [
    "(the) Romans [enter | are entering | do enter | enter into | are entering into | do enter into] the [camp | camps].",
  ],
  s32: [
    "We [give | are giving | do give] a [just | legitimate | open | fair | deserved] [reward | prize | gift] to a good man.",
    "We [give | are giving | do give] a good man a [just | legitimate | open | fair | deserved] [reward | prize | gift].",
  ],
  s33: [
    "(the) [bad | evil | wicked] men [prepare | are preparing | do prepare | design | are designing | do design] (the) [bad | evil | wicked] [plans | advice].",
  ],
  s34: [
    "(the) [bad | evil | wicked] plans [are prepared | are being prepared | are designed | are being designed] by (the) [bad | evil | wicked] men.",
    "(the) [bad | evil | wicked] advice [is prepared | is being prepared | is designed | is being designed] by (the) [bad | evil | wicked] men.",
  ],
  s35: [
    "(the) [poison | venom] [is prepared | is being prepared] by (the) [bad | evil | wicked] men.",
  ],
  s36: [
    "The [family | household] [has | is having | does have] [many | a lot of] tears.",
  ],
  s37: [
    "A good plan [is prepared | is being prepared | is designed | is being designed] by a [beautiful | nice | handsome | attractive | good-looking] man.",
    "(the) good advice [is prepared | is being prepared | is designed | is being designed] by a [beautiful | nice | handsome | attractive | good-looking] man.",
  ],
  s38: [
    "The [letter | epistle] [about | concerning | regarding | on] the [family | household] is long.",
  ],
  s39: [
    "(the) [wretched | sad | miserable | unhappy] men [always feel pain | are always feeling pain | do always feel pain | are always hurt | are always in pain | always suffer | are always suffering | do always suffer | always grieve | are always grieving | do always grieve].",
    "(the) [wretched | sad | miserable | unhappy] men [feel pain | are feeling pain | do feel pain | are hurt | are in pain | suffer | are suffering | do suffer | grieve | are grieving | do grieve] always.",
  ],
  s40: [
    "We [think about | are thinking about | do think about | think of | are thinking of | do think of | consider | are considering | do consider | ponder | are pondering | do ponder] [many | a lot of] plans, [for | in fact | because | since] we [love | are loving | do love] joy.",
  ],
  s41: [
    "I [cannot | am not able to | am unable to] judge.",
  ],
  s42: [
    "I [can | am able to] see (the) armed men.",
  ],
  s43: [
    "We [can | are able to] give the field to (the | our) friends.",
    "We [can | are able to] give (the | our) friends the field.",
  ],
  s44: [
    "I [often hold | am often holding | do often hold | frequently hold | am frequently holding | do frequently hold] a book.",
    "I [hold | am holding | do hold] a book [often | frequently].",
    "[often | frequently] I [hold | am holding | do hold] a book.",
  ],
  s45: [
    "We [can | are able to] teach (the | our) sons a good life.",
    "We [can | are able to] teach a good life to (the | our) sons.",
  ],
  s46: [
    "I [lie | am lying | do lie | lie down | am lying down | do lie down | am inert] in (the) [darkness | shadows] [for a long time | for a long while].",
    "I [lie | am lying | do lie | lie down | am lying down | do lie down | am inert] [for a long time | for a long while] in (the) [darkness | shadows].",
    "[for a long time | for a long while] I [lie | am lying | do lie | lie down | am lying down | do lie down | am inert] in (the) [darkness | shadows].",
    "in (the) [darkness | shadows] I [lie | am lying | do lie | lie down | am lying down | do lie down | am inert] [for a long time | for a long while].",
  ],
  s47: [
    "[because of | on account of | due to] (the) [darkness | shadows], I [remain | am remaining | do remain | stay | am staying | do stay] at home.",
    "I [remain | am remaining | do remain | stay | am staying | do stay] at home [because of | on account of | due to] (the) [darkness | shadows].",
  ],
  s48: [
    "While I [remain | am remaining | do remain | stay | am staying | do stay] in the field, I [think about | am thinking about | do think about | think of | am thinking of | do think of | consider | am considering | do consider | ponder | am pondering | do ponder] (the) good examples.",
    "I [think about | am thinking about | do think about | think of | am thinking of | do think of | consider | am considering | do consider | ponder | am pondering | do ponder] (the) good examples while I [remain | am remaining | do remain | stay | am staying | do stay] in the field.",
  ],
  s49: [
    "The sparrow [bites | is biting | does bite] the finger.",
  ],
  s50: [
    "The girl [says | is saying | does say | tells | is telling | does tell | reports | is reporting | does report] (that) the sparrow [bites | is biting | does bite] the finger.",
  ],
  s51: [
    "Catullus [sees | is seeing | does see]: the girl loves [the | a | her] [pet | delight | darling].",
    "Catullus [sees | is seeing | does see]: the girl loves (the | her) [pets | delights].",
  ],
  s52: [
    "The sparrow [remains | is remaining | does remain | stays | is staying | does stay] in the [mistress's | mistress' | lady's] lap.",
    "The sparrow [remains | is remaining | does remain | stays | is staying | does stay] in the lap of the [mistress | lady].",
  ],
  s53: [
    "The mistress [thinks | is thinking | does think | considers | is considering | does consider | believes | is believing | does believe] (that) she (herself) [loves | is loving | does love] the sparrow.",
  ],
  s54: [
    "The old man [tells | is telling | does tell | narrates | is narrating | does narrate | relates | is relating | does relate | recounts | is recounting | does recount] my sister [serious | strict | severe | stern | harsh] words.",
    "The old man [tells | is telling | does tell | narrates | is narrating | does narrate | relates | is relating | does relate | recounts | is recounting | does recount] (the) [serious | strict | severe | stern | harsh] words to my sister.",
  ],
  s55: [
    "I [regard | am regarding | do regard | esteem | am esteeming | do esteem | admire | am admiring | do admire | value | am valuing | do value | think highly of | am thinking highly of | do think highly of] the [mistress's | mistress' | lady's] [beautiful | nice | lovely | pretty] eyes.",
    "I [regard | am regarding | do regard | esteem | am esteeming | do esteem | admire | am admiring | do admire | value | am valuing | do value | think highly of | am thinking highly of | do think highly of] (the) [beautiful | nice | lovely | pretty] eyes of the [mistress | lady].",
  ],
  s56: [
    "I [do not envy | am not envying | am not jealous of | am not envious of] the [serious | strict | severe | stern | harsh] old man.",
  ],
  s57: [
    "(the) Greeks [are saved | are being saved | are preserved | are being preserved | are rescued | are being rescued | are protected | are being protected] by the [leader | general | commander].",
  ],
  s58: [
    "(the) Athenians [walk | are walking | do walk] [to | toward | towards | into] the Delphic temple.",
    "(the) Athenians [walk | are walking | do walk] [to | toward | towards | into] the temple [at | of | in] Delphi.",
  ],
  s59: [
    "The king of (the) Persians [sails | is sailing | does sail | voyages | is voyaging | does voyage] [to | toward | towards | into] Greece.",
    "(the) Persians' king [sails | is sailing | does sail | voyages | is voyaging | does voyage] [to | toward | towards | into] Greece.",
  ],
  s60: [
    "The [leader | general | commander] [conquers | is conquering | does conquer | defeats | is defeating | does defeat | overcomes | is overcoming | does overcome | beats | is beating | does beat] (the) soldiers.",
  ],
  s61: [
    "The king [seeks | is seeking | does seek | heads for | is heading for | does head for | goes to | is going to | does go to | rushes at | is rushing at | does rush at | looks for | is looking for | does look for | consults | is consulting | does consult] the oracle.",
  ],
  s62: [
    "(the) soldiers [free | are freeing | do free | liberate | are liberating | do liberate | set free | are setting free | do set free] (the) [people | men | human beings | humans] from fear.",
  ],
  s63: [
    "[at last | finally | in the end] we [conquer | are conquering | do conquer | defeat | are defeating | do defeat | overcome | are overcoming | do overcome | beat | are beating | do beat] (the) [people | men | human beings | humans].",
    "We [at last conquer | are at last conquering | do at last conquer | finally conquer | are finally conquering | do finally conquer | at last defeat | are at last defeating | do at last defeat | finally defeat | are finally defeating | do finally defeat | at last overcome | are at last overcoming | do at last overcome | finally overcome | are finally overcoming | do finally overcome | at last beat | are at last beating | do at last beat | finally beat | are finally beating | do finally beat] (the) [people | men | human beings | humans].",
    "We [conquer | are conquering | do conquer | defeat | are defeating | do defeat | overcome | are overcoming | do overcome | beat | are beating | do beat] (the) [people | men | human beings | humans] [at last | finally | in the end].",
  ],
  s64: [
    "[then | at that time] the king [sails | is sailing | does sail | voyages | is voyaging | does voyage] with (the) soldiers.",
    "The king [then sails | is then sailing | does then sail | then voyages | is then voyaging | does then voyage] with (the) soldiers.",
    "The king [sails | is sailing | does sail | voyages | is voyaging | does voyage] with (the) soldiers [then | at that time].",
  ],
  s65: [
    "(the) women's [cries | shouts | screams | clamors] [are heard | are being heard | are listened to | are being listened to].",
    "(the) [cries | shouts | screams | clamors] of (the) women [are heard | are being heard | are listened to | are being listened to].",
  ],
  s66: [
    "(the) [bad | evil | wicked] times [come | are coming | do come].",
  ],
  s67: [
    "(the) citizens [can | are able to] be [saved | preserved | rescued | protected] by the consul.",
  ],
  s68: [
    "The consul [makes | is making | does make | has | is having | does have | gives | is giving | does give | delivers | is delivering | does deliver] a speech in the city.",
    "In the city the consul [makes | is making | does make | has | is having | does have | gives | is giving | does give | delivers | is delivering | does deliver] a speech.",
  ],
  s69: [
    "(the) citizens [hear | are hearing | do hear | listen to | are listening to | do listen to] (the) words of the consul.",
    "(the) citizens [hear | are hearing | do hear | listen to | are listening to | do listen to] the consul's words.",
  ],
  s70: [
    "The woman [believes | is believing | does believe | trusts | is trusting | does trust] the consul.",
  ],
  s71: [
    "Time [does not fear | is not fearing | is not afraid of | is not scared of] death.",
  ],
  s72: [
    "My body [hurts | is hurting | does hurt | feels pain | is feeling pain | does feel pain | is hurt | aches | is aching | does ache | is in pain].",
  ],
  s73: [
    "(the) plans [are made | are being made | are taken | are being taken | are adopted | are being adopted | are captured | are being captured | are formed | are being formed] by (the) Greeks.",
  ],
  s74: [
    "The [brave | strong | courageous] [do not always win | are not always winning | do not always conquer | are not always conquering | do not always prevail | are not always prevailing].",
    "(the) [brave | strong | courageous] [men | people | ones] [do not always win | are not always winning | do not always conquer | are not always conquering | do not always prevail | are not always prevailing].",
  ],
  s75: [
    "The [fortunate | happy | lucky] [are freed | are being freed | are liberated | are being liberated | are set free | are being set free] from fear.",
    "(the) [fortunate | happy | lucky] [people | ones] [are freed | are being freed | are liberated | are being liberated | are set free | are being set free] from fear.",
  ],
  s76: [
    "The [brave | strong | courageous] soldier [does not fear | is not fearing | is not afraid of | is not scared of] the [enemy | foe].",
  ],
  s77: [
    "(a) few citizens [desire | are desiring | do desire | want | are wanting | do want | wish | are wishing | do wish] to [conquer | defeat | overcome | beat] (the) danger.",
  ],
  s78: [
    "(the) [enemies | foes] [destroy | are destroying | do destroy] the city [with | by | by means of] (the) [flames | fire].",
    "[With | By | By means of] (the) [flames | fire] (the) [enemies | foes] [destroy | are destroying | do destroy] the city.",
  ],
  s79: [
    "[at night | in the night | by night | during the night] (a) few soldiers [flee | are fleeing | do flee | run away | are running away | do run away].",
    "(a) few soldiers [flee | are fleeing | do flee | run away | are running away | do run away] [at night | in the night | by night | during the night].",
  ],
  s80: [
    "We [neither fear nor love | are neither fearing nor loving] (the) gods.",
    "We neither fear (the) gods nor love them.",
    "We are neither fearing (the) gods nor loving them.",
    "We [do not fear or love | do not fear nor love | are not fearing or loving] (the) gods.",
    "We do not fear (the) gods, nor do we love them.",
    "We are not fearing (the) gods, nor are we loving them.",
    "We are not afraid of (the) gods, nor do we love them.",
    "We do not fear (the) gods and (we) do not love them.",
  ],
  // Chapters 11-21 (2026-11-17)
  s81: [
    "The queen [was loving | used to love] Aeneas [very much | greatly | exceedingly].",
    "The queen [was very much loving | was greatly loving | was exceedingly loving | very much used to love | greatly used to love | exceedingly used to love] Aeneas.",
  ],
  s82: [
    "[From | Out of] the [cave | cavern | grotto] we [were watching | used to watch | were observing | used to observe | were looking at | used to look at | were seeing | used to see | were catching sight of | used to catch sight of] the [storm | tempest].",
    "We [were watching | used to watch | were observing | used to observe | were looking at | used to look at | were seeing | used to see | were catching sight of | used to catch sight of] the [storm | tempest] [from | out of] the [cave | cavern | grotto].",
  ],
  s83: [
    "Aeneas and Dido [were walking | used to walk] together.",
    "Together Aeneas and Dido [were walking | used to walk].",
  ],
  s84: [
    "(the) Trojans [were being called | used to be called | were being summoned | used to be summoned] [into | to | toward | towards] the city by the queen.",
    "(the) Trojans [were being called | used to be called | were being summoned | used to be summoned] by the queen [into | to | toward | towards] the city.",
  ],
  s85: [
    "The queen's [mind | spirit | soul] [was being held | used to be held | was being gripped | used to be gripped | was being possessed | used to be possessed] [by | with] [cruel | harsh | brutal | savage] [grief | pain | sorrow].",
    "The [mind | spirit | soul] of the queen [was being held | used to be held | was being gripped | used to be gripped | was being possessed | used to be possessed] [by | with] [cruel | harsh | brutal | savage] [grief | pain | sorrow].",
  ],
  s86: [
    "[were you afraid of | were you scared of | were you fearing] the [storm | tempest] (my) friend?",
    "(my) friend [were you afraid of | were you scared of | were you fearing] the [storm | tempest]?",
  ],
  s87: [
    "Aeneas [was abandoning | used to abandon | was leaving | used to leave | was leaving behind | used to leave behind | was deserting | used to desert | was forsaking | used to forsake] the [wretched | sad | miserable | unhappy] queen.",
  ],
  s88: [
    "The queen [was not able to | could not | was unable to] [hold | hold back | restrain | contain] (her | the) [grief | pain | sorrow].",
  ],
  s89: [
    "Mucius [puts | is putting | does put | places | is placing | does place | sets | is setting | does set] [the | his] [right hand | right] [into | in] the [fire | flames | flame].",
  ],
  s90: [
    "The [fire | flame] [was consuming | used to consume | was devouring | used to devour | was burning | used to burn | was burning up | used to burn up] [Mucius's | Mucius'] [right hand | right].",
    "The [fire | flame] [was consuming | used to consume | was devouring | used to devour | was burning | used to burn | was burning up | used to burn up] the [right hand | right] of Mucius.",
    "The flames [were consuming | used to consume | were devouring | used to devour | were burning | used to burn | were burning up | used to burn up] [Mucius's | Mucius'] [right hand | right].",
    "The flames [were consuming | used to consume | were devouring | used to devour | were burning | used to burn | were burning up | used to burn up] the [right hand | right] of Mucius.",
  ],
  s91: [
    "Porsenna [was not understanding | did not use to understand | used not to understand | was not comprehending | did not use to comprehend | used not to comprehend | was not grasping | did not use to grasp | used not to grasp] the [strength | force | power | might] of (the) Romans.",
    "Porsenna [was not understanding | did not use to understand | used not to understand | was not comprehending | did not use to comprehend | used not to comprehend | was not grasping | did not use to grasp | used not to grasp] the Romans' [strength | force | power | might].",
  ],
  s92: [
    "We [wage | are waging | do wage | carry on | are carrying on | do carry on | conduct | are conducting | do conduct | make | are making | do make] (the) war against you.",
    "Against you we [wage | are waging | do wage | carry on | are carrying on | do carry on | conduct | are conducting | do conduct | make | are making | do make] (the) war.",
  ],
  s93: [
    "My name is Mucius.",
    "Mucius is my name.",
  ],
  s94: [
    "You [were showing | used to show | were displaying | used to display] [him | her | it] your [right hand | right].",
    "You [were showing | used to show | were displaying | used to display] your [right hand | right] to [him | her | it].",
  ],
  s95: [
    "Your city is [near | near to | close to | next to] our [camp | camps].",
  ],
  s96: [
    "I [do not fear | am not afraid of | am not scared of | am not fearing] (the) [fire | flames], [for | because | since | in fact] I am (the) Roman.",
  ],
  s97: [
    "[go away | leave | depart | withdraw | go] (my) friend and [goodbye | good bye | farewell | fare well | be well]!",
    "(my) friend [go away | leave | depart | withdraw | go] and [goodbye | good bye | farewell | fare well | be well]!",
    "[go away | leave | depart | withdraw | go] and [goodbye | good bye | farewell | fare well | be well] (my) friend!",
  ],
  s98: [
    "Do not [ask | question] me!",
  ],
  s99: [
    "Come with me [to | toward | towards] the judge!",
    "Come [to | toward | towards] the judge with me!",
  ],
  s100: [
    "[Many | A lot] of you [love | are loving | do love] [Horace | Horatius].",
  ],
  s101: [
    "(the) love [for | of] you [holds | is holding | does hold | grips | is gripping | does grip] me.",
    "My love for you [holds | is holding | does hold | grips | is gripping | does grip] me.",
  ],
  s102: [
    "[Horace | Horatius] [was walking | used to walk] [to | toward | towards] [his | his own] friend's [cottage | little house | small house | hut].",
    "[Horace | Horatius] [was walking | used to walk] [to | toward | towards] the [cottage | little house | small house | hut] of [his | his own] friend.",
  ],
  s103: [
    "The judge is [learned | educated | scholarly], and [his | her] son is also [learned | educated | scholarly].",
    "The judge is [learned | educated | scholarly], and [his | her] son also is [learned | educated | scholarly].",
    "The judge is [learned | educated | scholarly], and [his | her] son is [learned | educated | scholarly] [too | as well].",
    "The judge is [learned | educated | scholarly], and [his | her] son, too, is [learned | educated | scholarly].",
  ],
  s104: [
    "The [rich | wealthy] man [has | is having | does have | possesses | does possess | owns | does own] [everything | all things | all], but (he) [knows nothing | does know nothing | does not know anything | does not know a thing].",
  ],
  s105: [
    "(the | our) parents [will not be able to | will be unable to | shall not be able to | shall be unable to] [separate | part | divide] us.",
  ],
  s106: [
    "I [will wait for | shall wait for | will be waiting for | shall be waiting for | will await | shall await | will be awaiting | shall be awaiting | will expect | shall expect | will be expecting | shall be expecting] you [near | near to | close to | next to] the white tree.",
    "[near | near to | close to | next to] the white tree I [will wait for | shall wait for | will be waiting for | shall be waiting for | will await | shall await | will be awaiting | shall be awaiting | will expect | shall expect | will be expecting | shall be expecting] you.",
  ],
  s107: [
    "The girl (whom | that) Pyramus [loves | is loving | does love] is [beautiful | nice | lovely | pretty | handsome | attractive | good-looking].",
  ],
  s108: [
    "The man [who | that] [holds | is holding | does hold | grips | is gripping | does grip] the sword is Pyramus.",
  ],
  s109: [
    "Pyramus, whose [appearance | form] was [beautiful | nice | lovely | pretty | handsome | attractive | good-looking], [was loving | used to love] the girl.",
    "Pyramus, whose looks were [beautiful | nice | lovely | pretty | handsome | attractive | good-looking], [was loving | used to love] the girl.",
  ],
  s110: [
    "Our love [will always remain | shall always remain | will always be remaining | shall always be remaining | will always stay | shall always stay | will always be staying | shall always be staying].",
    "Our love [will remain | shall remain | will be remaining | shall be remaining | will stay | shall stay | will be staying | shall be staying] always.",
    "Always our love [will remain | shall remain | will be remaining | shall be remaining | will stay | shall stay | will be staying | shall be staying].",
  ],
  s111: [
    "We [will be separated | shall be separated | will be parted | shall be parted | will be divided | shall be divided] by our parents.",
    "By our parents we [will be separated | shall be separated | will be parted | shall be parted | will be divided | shall be divided].",
  ],
  s112: [
    "(the) blood [flows | is flowing | does flow | runs | is running | does run | pours | is pouring | does pour | streams | is streaming | does stream] from [the | his | her] [chest | breast] [onto | to | into] the [ground | earth | land | soil].",
    "(the) blood [flows | is flowing | does flow | runs | is running | does run | pours | is pouring | does pour | streams | is streaming | does stream] [onto | to | into] the [ground | earth | land | soil] from [the | his | her] [chest | breast].",
  ],
  s113: [
    "Who [will take care of | shall take care of | will be taking care of | shall be taking care of | will care for | shall care for | will be caring for | shall be caring for | will heal | shall heal | will be healing | shall be healing | will look after | shall look after | will be looking after | shall be looking after | will tend | shall tend | will be tending | shall be tending] the [old | aged | ancient] [villa | country house | country home | estate]?",
  ],
  s114: [
    "I [will spend | shall spend | will be spending | shall be spending | will pass | shall pass | will be passing | shall be passing | will live out | shall live out | will be living out | shall be living out | will live through | shall live through | will be living through | shall be living through | will lead | shall lead | will be leading | shall be leading] (my | the) old age in a [country | rural | rustic] [villa | estate | house | home].",
    "In a [country | rural | rustic] [villa | estate | house | home] I [will spend | shall spend | will be spending | shall be spending | will pass | shall pass | will be passing | shall be passing | will live out | shall live out | will be living out | shall be living out | will live through | shall live through | will be living through | shall be living through | will lead | shall lead | will be leading | shall be leading] (my | the) old age.",
  ],
  s115: [
    "Why [do you neglect | are you neglecting | do you disregard | are you disregarding | do you ignore | are you ignoring] your [villa | country house | country home | estate]?",
  ],
  s116: [
    "[What | Which] [proofs | indications | arguments | signs | evidence] of old age [do you see | are you seeing]?",
  ],
  s117: [
    "The [old | aged | ancient] [villa | country house | country home | estate] [will soon be abandoned | will shortly be abandoned | shall soon be abandoned | shall shortly be abandoned | will soon be left | will shortly be left | shall soon be left | shall shortly be left | will soon be left behind | will shortly be left behind | shall soon be left behind | shall shortly be left behind | will soon be deserted | will shortly be deserted | shall soon be deserted | shall shortly be deserted | will soon be forsaken | will shortly be forsaken | shall soon be forsaken | shall shortly be forsaken].",
    "The [old | aged | ancient] [villa | country house | country home | estate] [will be abandoned | shall be abandoned | will be left | shall be left | will be left behind | shall be left behind | will be deserted | shall be deserted | will be forsaken | shall be forsaken] [soon | shortly].",
    "[soon | shortly] the [old | aged | ancient] [villa | country house | country home | estate] [will be abandoned | shall be abandoned | will be left | shall be left | will be left behind | shall be left behind | will be deserted | shall be deserted | will be forsaken | shall be forsaken].",
  ],
  s118: [
    "What [will | shall] you [do | make | be doing | be making] [in | at] the [villa | country house | country home | estate]?",
  ],
  s119: [
    "[Look | Look here | Behold | See | Lo] (the) [old | aged | ancient] trees [stand | are standing | do stand] [everywhere | in every place | all over]!",
    "[Look | Look here | Behold | See | Lo] [everywhere | in every place | all over] (the) [old | aged | ancient] trees [stand | are standing | do stand]!",
  ],
  s120: [
    "[In | During] old age (the) life will not be [difficult | hard].",
    "(the) life will not be [difficult | hard] [in | during] old age.",
  ],
  s121: [
    "We [saw | have seen | did see] a [large | great | big] cloud in [the sky | heaven | the heaven | the heavens].",
    "In [the sky | heaven | the heaven | the heavens] we [saw | have seen | did see] a [large | great | big] cloud.",
  ],
  s122: [
    "My uncle [sent | has sent | did send] the [fleet | navy] [to | toward | towards] the [shore | coast | beach].",
  ],
  s123: [
    "My uncle [had | used to have | possessed | used to possess | owned | used to own] [many | a lot of] [ships | vessels | boats].",
  ],
  s124: [
    "(the) [ash | ashes] and (the) smoke [overwhelmed | have overwhelmed | did overwhelm | suppressed | have suppressed | did suppress | overpowered | have overpowered | did overpower | smothered | have smothered | did smother | overcame | have overcome | did overcome] (the) [women | ladies].",
  ],
  s125: [
    "I [stayed | have stayed | did stay | remained | have remained | did remain] at home and (I) [read | have read | did read | chose | have chosen | did choose] (the) books.",
  ],
  s126: [
    "I [have never seen | never saw] [so great a | so large a | so big a | such a great | such a large | such a big | such a] [disaster | calamity | catastrophe].",
    "Never [have I seen | did I see] [so great a | so large a | so big a | such a great | such a large | such a big | such a] [disaster | calamity | catastrophe].",
    "I [have never seen | never saw] a [disaster | calamity | catastrophe] so [large | great | big].",
  ],
  s127: [
    "The mountain [burned | burnt | has burned | has burnt | did burn | was on fire]; [therefore | and therefore | so | and so | thus | and thus | consequently] (the) [people | men | human beings | humans] [fled | have fled | did flee | ran away | have run away | did run away].",
    "The mountain [burned | burnt | has burned | has burnt | did burn | was on fire]; (the) [people | men | human beings | humans] [therefore | thus | consequently] [fled | have fled | did flee | ran away | have run away | did run away].",
  ],
  s128: [
    "(the) sailors [were not able to | could not | were unable to | have not been able to | have been unable to] [save | preserve | rescue | protect] (the) [people | men | human beings | humans].",
  ],
  s129: [
    "(the) winds [were feeding | used to feed | were nourishing | used to nourish | were fueling | used to fuel | were fuelling] the [fire | blaze | conflagration | eruption].",
  ],
  s130: [
    "(the) flames [had seized | had engulfed] [many | a lot of] [houses | homes].",
  ],
  s131: [
    "In (the) [confusion | uproar | tumult | commotion | chaos], (the) [people | men | human beings | humans] [were running | used to run | were rushing | used to rush] [through | along] (the) [streets | roads | ways | paths].",
    "(the) [people | men | human beings | humans] [were running | used to run | were rushing | used to rush] [through | along] (the) [streets | roads | ways | paths] in (the) [confusion | uproar | tumult | commotion | chaos].",
  ],
  s132: [
    "(the) soldiers [had tried | had attempted] to [put out | extinguish | quench | douse] the [fire | blaze | conflagration | eruption] [with | by means of] [their | the] hands.",
    "(the) soldiers [had tried | had attempted] [with | by means of] [their | the] hands to [put out | extinguish | quench | douse] the [fire | blaze | conflagration | eruption].",
    "[with | by means of] [their | the] hands (the) soldiers [had tried | had attempted] to [put out | extinguish | quench | douse] the [fire | blaze | conflagration | eruption].",
  ],
  s133: [
    "The [uproar | confusion | tumult] was [large | great | big], and (the) horns [were not being heard | were not being listened to].",
  ],
  s134: [
    "We [had felt | had sensed | had perceived] the [force | impetus | attack | power] of (the) winds.",
    "We [had felt | had sensed | had perceived] the winds' [force | impetus | attack | power].",
  ],
  s135: [
    "[many | a lot of] [people | men | human beings | humans] had lost [their | their own] [houses | homes].",
  ],
  s136: [
    "Nero had not been in the city.",
  ],
  s137: [
    "If you [see | have seen | will have seen] [your | the] husband's face, you will lose him.",
    "If you [see | have seen | will have seen] the face of [your | the] husband, you will lose him.",
    "You will lose him if you [see | have seen | will have seen] [your | the] husband's face.",
    "You will lose him if you [see | have seen | will have seen] the face of [your | the] husband.",
  ],
  s138: [
    "(the) [people | men | human beings | humans] [were no longer worshipping | no longer used to worship | were no longer worshiping | were no longer honoring | no longer used to honor | were no longer honouring | no longer used to honour | were no longer revering | no longer used to revere] Venus.",
    "(the) [people | men | human beings | humans] [were not worshipping | did not use to worship | used not to worship | were not worshiping | were not honoring | did not use to honor | used not to honor | were not honouring | did not use to honour | used not to honour | were not revering | did not use to revere | used not to revere] Venus [any longer | any more | anymore].",
  ],
  s139: [
    "[at midday | at mid day | at noon | at noontime | in the middle of the day | at the middle of the day] the wife [was sleeping | used to sleep | was slumbering | used to slumber].",
    "The wife [was sleeping | used to sleep | was slumbering | used to slumber] [at midday | at mid day | at noon | at noontime | in the middle of the day | at the middle of the day].",
  ],
  s140: [
    "If you [wake | wake up | awaken | rouse | stir up | have woken | have woken up | have awakened | have roused | have stirred up | will have woken | will have woken up | will have awakened | will have roused | will have stirred up] [your | the] husband, he will [flee | run away].",
    "If you [wake | have woken | will have woken | stir | have stirred | will have stirred] [your | the] husband up, he will [flee | run away].",
    "He will [flee | run away] if you [wake | wake up | awaken | rouse | stir up | have woken | have woken up | have awakened | have roused | have stirred up | will have woken | will have woken up | will have awakened | will have roused | will have stirred up] [your | the] husband.",
    "He will [flee | run away] if you [wake | have woken | will have woken | stir | have stirred | will have stirred] [your | the] husband up.",
  ],
  s141: [
    "The husband was so [beautiful | nice | lovely | pretty | handsome | attractive | good-looking], but (he) [was hiding | used to hide | was concealing | used to conceal | kept hiding | kept concealing] [his | his own] face.",
  ],
  s142: [
    "The wife [told | has told | did tell | narrated | has narrated | did narrate | related | has related | did relate | recounted | has recounted | did recount] the [matter | thing | affair] to (the | her) sisters.",
    "The wife [told | has told | did tell | narrated | has narrated | did narrate | related | has related | did relate | recounted | has recounted | did recount] (the | her) sisters the [matter | thing | affair].",
  ],
  s143: [
    "After [many | a lot of] days the wife [saw | has seen | did see] [her | the] husband.",
    "The wife [saw | has seen | did see] [her | the] husband after [many | a lot of] days.",
  ],
  s144: [
    "[Cupid | Cupido] [will look for | shall look for | will be looking for | shall be looking for | will search for | shall search for | will be searching for | shall be searching for | will seek | shall seek | will be seeking | shall be seeking | will search | shall search | will be searching | shall be searching] [his | his own] wife if he [loses | has lost | will have lost] her.",
    "If he [loses | has lost | will have lost] her, [Cupid | Cupido] [will look for | shall look for | will be looking for | shall be looking for | will search for | shall search for | will be searching for | shall be searching for | will seek | shall seek | will be seeking | shall be seeking | will search | shall search | will be searching | shall be searching] [his | his own] wife.",
  ],
  s145: [
    "(the) Huns [do not cook | are not cooking] (the) [meat | flesh].",
  ],
  s146: [
    "These [fierce | ferocious | savage] [people | men | human beings | humans] [live | are living | do live] [outdoors | outside | in the open | out in the open | out of doors].",
  ],
  s147: [
    "(the | their) [clothes | garments] [were made | have been made] [from | out of] (the) [skins | hides | pelts].",
    "(the | their) clothing [was made | has been made] [from | out of] (the) [skins | hides | pelts].",
  ],
  s148: [
    "[many | a lot of] soldiers [were wounded | have been wounded | were injured | have been injured] in [the battle | battle | combat | the combat].",
    "In [the battle | battle | combat | the combat] [many | a lot of] soldiers [were wounded | have been wounded | were injured | have been injured].",
  ],
  s149: [
    "[After | When] the city [was captured | has been captured | was taken | has been taken], (the) [enemies | foes] [quickly left | swiftly left | rapidly left | fast left | have quickly left | have swiftly left | have rapidly left | have fast left | did quickly leave | did swiftly leave | did rapidly leave | did fast leave | quickly went away | swiftly went away | rapidly went away | fast went away | have quickly gone away | have swiftly gone away | have rapidly gone away | have fast gone away | did quickly go away | did swiftly go away | did rapidly go away | did fast go away | quickly departed | swiftly departed | rapidly departed | fast departed | have quickly departed | have swiftly departed | have rapidly departed | have fast departed | did quickly depart | did swiftly depart | did rapidly depart | did fast depart].",
    "[After | When] the city [was captured | has been captured | was taken | has been taken], (the) [enemies | foes] [left | have left | did leave | went away | have gone away | did go away | departed | have departed | did depart] [quickly | swiftly | rapidly | fast].",
    "(the) [enemies | foes] [quickly left | swiftly left | rapidly left | fast left | have quickly left | have swiftly left | have rapidly left | have fast left | did quickly leave | did swiftly leave | did rapidly leave | did fast leave | quickly went away | swiftly went away | rapidly went away | fast went away | have quickly gone away | have swiftly gone away | have rapidly gone away | have fast gone away | did quickly go away | did swiftly go away | did rapidly go away | did fast go away | quickly departed | swiftly departed | rapidly departed | fast departed | have quickly departed | have swiftly departed | have rapidly departed | have fast departed | did quickly depart | did swiftly depart | did rapidly depart | did fast depart] [after | when] the city [was captured | has been captured | was taken | has been taken].",
    "(the) [enemies | foes] [left | have left | did leave | went away | have gone away | did go away | departed | have departed | did depart] [quickly | swiftly | rapidly | fast] [after | when] the city [was captured | has been captured | was taken | has been taken].",
  ],
  s150: [
    "The soldiers' [wounds | injuries] [were healed | have been healed | were cured | have been cured | were treated | have been treated] [with | by | by means of] (the) [plants | herbs | vegetation].",
    "The [wounds | injuries] of the soldiers [were healed | have been healed | were cured | have been cured | were treated | have been treated] [with | by | by means of] (the) [plants | herbs | vegetation].",
  ],
  s151: [
    "This man [does not have | does not possess | does not own] the beard.",
    "This man [has no | possesses no | owns no] beard.",
  ],
  s152: [
    "(the) enemies, [defeated | conquered | beaten | overcome] by (the) Huns, [fled | have fled | did flee | ran away | have run away | did run away].",
    "(the) enemies, having been [defeated | conquered | beaten | overcome] by (the) Huns, [fled | have fled | did flee | ran away | have run away | did run away].",
    "(the) enemies, who [had been | were] [defeated | conquered | beaten | overcome] by (the) Huns, [fled | have fled | did flee | ran away | have run away | did run away].",
    "[defeated | conquered | beaten | overcome] by (the) Huns, (the) enemies [fled | have fled | did flee | ran away | have run away | did run away].",
    "Having been [defeated | conquered | beaten | overcome] by (the) Huns, (the) enemies [fled | have fled | did flee | ran away | have run away | did run away].",
    "[After being | After having been | When | Once] [defeated | conquered | beaten | overcome] by (the) Huns, (the) enemies [fled | have fled | did flee | ran away | have run away | did run away].",
    "(the) enemies [fled | have fled | did flee | ran away | have run away | did run away], [defeated | conquered | beaten | overcome] by (the) Huns.",
  ],
  s153: [
    "[at night | in the night | by night | during the night] (the) [young men | young people | youths | young adults | young women | young ladies | adolescents] [took | have taken | did take | captured | have captured | did capture | seized | have seized | did seize] [almost | nearly] all (of) (the) [fruit | fruits].",
    "(the) [young men | young people | youths | young adults | young women | young ladies | adolescents] [took | have taken | did take | captured | have captured | did capture | seized | have seized | did seize] [almost | nearly] all (of) (the) [fruit | fruits] [at night | in the night | by night | during the night].",
  ],
  s154: [
    "[Augustine | Augustinus] [says | is saying | does say | tells | is telling | does tell | reports | is reporting | does report] (that) he (himself) [took | has taken | did take | captured | has captured | did capture | seized | has seized | did seize | had taken | had captured | had seized] (the) [fruit | fruits].",
  ],
  s155: [
    "That [theft | stealing] [had delighted | had pleased] [Augustine | Augustinus].",
  ],
  s156: [
    "That [young man | youth | young person | young adult | adolescent] [was not lacking | was not in need of | did not use to lack | used not to lack | did not use to need | used not to need] (the) [fruit | fruits].",
  ],
  s157: [
    "(the) human laws [punish | are punishing | do punish] (the) [theft | stealing].",
  ],
  s158: [
    "The thief had been punished by the judge.",
  ],
  s159: [
    "We [think | are thinking | do think | consider | are considering | do consider | believe | are believing | do believe] (that) (the) fruit [was taken | has been taken | was captured | has been captured | was seized | has been seized | had been taken | had been captured | had been seized] by those [young men | young people | youths | young adults | young women | young ladies | adolescents].",
    "We [think | are thinking | do think | consider | are considering | do consider | believe | are believing | do believe] (that) (the) fruits [were taken | have been taken | were captured | have been captured | were seized | have been seized | had been taken | had been captured | had been seized] by those [young men | young people | youths | young adults | young women | young ladies | adolescents].",
  ],
  s160: [
    "Those fruits [had not been eaten | had not been devoured | had not been consumed] by (the) thieves.",
  ],
  s161: [
    "[Fortune | Fortuna | the goddess Fortune | the goddess Fortuna] [always turns | is always turning | does always turn | always spins | is always spinning | does always spin | always rotates | is always rotating | does always rotate] [her | her own] wheel.",
    "[Fortune | Fortuna | the goddess Fortune | the goddess Fortuna] [turns | is turning | does turn | spins | is spinning | does spin | rotates | is rotating | does rotate] [her | her own] wheel always.",
  ],
  s162: [
    "(the) [wealth | riches] and (the) [honors | honours | offices | public offices | distinctions] [will be snatched away | shall be snatched away | will be snatched | shall be snatched | will be seized | shall be seized | will be taken away | shall be taken away] by [Fortune | Fortuna | the goddess Fortune | the goddess Fortuna].",
  ],
  s163: [
    "(the) [people | men | human beings | humans] (whom | that) [Fortune | Fortuna | the goddess Fortune | the goddess Fortuna] [lifts up | is lifting up | does lift up | lifts | is lifting | does lift | raises | is raising | does raise | elevates | is elevating | does elevate | destroys | is destroying | does destroy] [will soon descend | will shortly descend | shall soon descend | shall shortly descend | will soon be descending | will shortly be descending | shall soon be descending | shall shortly be descending | will soon come down | will shortly come down | shall soon come down | shall shortly come down | will soon be coming down | will shortly be coming down | shall soon be coming down | shall shortly be coming down | will soon go down | will shortly go down | shall soon go down | shall shortly go down | will soon be going down | will shortly be going down | shall soon be going down | shall shortly be going down].",
    "(the) [people | men | human beings | humans] (whom | that) [Fortune | Fortuna | the goddess Fortune | the goddess Fortuna] [lifts up | is lifting up | does lift up | lifts | is lifting | does lift | raises | is raising | does raise | elevates | is elevating | does elevate | destroys | is destroying | does destroy] [will descend | shall descend | will be descending | shall be descending | will come down | shall come down | will be coming down | shall be coming down | will go down | shall go down | will be going down | shall be going down] [soon | shortly].",
  ],
  s164: [
    "[Fortune | Fortuna | the goddess Fortune | the goddess Fortuna], [about to | going to | intending to] [snatch away | snatch | seize | take away] (the | our) [wealth | riches], [comes | is coming | does come] [to | toward | towards] us.",
    "[Fortune | Fortuna | the goddess Fortune | the goddess Fortuna], who is [about to | going to] [snatch away | snatch | seize | take away] (the | our) [wealth | riches], [comes | is coming | does come] [to | toward | towards] us.",
    "[Fortune | Fortuna | the goddess Fortune | the goddess Fortuna] [comes | is coming | does come] [to | toward | towards] us, [about to | going to | intending to] [snatch away | snatch | seize | take away] (the | our) [wealth | riches].",
  ],
  s165: [
    "I [think | am thinking | do think | consider | am considering | do consider | believe | am believing | do believe] (that) [Fortune | Fortuna | the goddess Fortune | the goddess Fortuna] [will | shall | is about to | is going to] [turn | spin | rotate] [the | her] wheel.",
  ],
  s166: [
    "If your wealth [is snatched away | has been snatched away | will have been snatched away | shall have been snatched away | is snatched | has been snatched | will have been snatched | shall have been snatched | is seized | has been seized | will have been seized | shall have been seized | is taken away | has been taken away | will have been taken away | shall have been taken away], do not [grieve | suffer | feel pain | be hurt | be in pain | mourn]!",
    "If your riches [are snatched away | have been snatched away | will have been snatched away | shall have been snatched away | are snatched | have been snatched | will have been snatched | shall have been snatched | are seized | have been seized | will have been seized | shall have been seized | are taken away | have been taken away | will have been taken away | shall have been taken away], do not [grieve | suffer | feel pain | be hurt | be in pain | mourn]!",
    "Do not [grieve | suffer | feel pain | be hurt | be in pain | mourn] if your wealth [is snatched away | has been snatched away | will have been snatched away | shall have been snatched away | is snatched | has been snatched | will have been snatched | shall have been snatched | is seized | has been seized | will have been seized | shall have been seized | is taken away | has been taken away | will have been taken away | shall have been taken away]!",
    "Do not [grieve | suffer | feel pain | be hurt | be in pain | mourn] if your riches [are snatched away | have been snatched away | will have been snatched away | shall have been snatched away | are snatched | have been snatched | will have been snatched | shall have been snatched | are seized | have been seized | will have been seized | shall have been seized | are taken away | have been taken away | will have been taken away | shall have been taken away]!",
  ],
  s167: [
    "We [do not possess | do not own | do not have] (the) [external | outward] [things | matters | affairs] [for certain | for sure | with certainty | certainly].",
    "[for certain | for sure | with certainty | certainly] we [do not possess | do not own | do not have] (the) [external | outward] [things | matters | affairs].",
  ],
  s168: [
    "The wheel [is turned | is being turned | is spun | is being spun | is rotated | is being rotated] around the [axle | axis].",
  ],
  s169: [
    "[you all | y'all | yall] [tell | are telling | do tell | narrate | are narrating | do narrate | relate | are relating | do relate | recount | are recounting | do recount] (the) [stories | tales | fables] well.",
  ],
  s170: [
    "The girls [fear | are fearing | do fear | are afraid of | are scared of] the [stream | brook]; [and so | so | therefore | and therefore] we [walk | are walking | do walk] [on | in] the [road | street | way | path].",
  ],
  s171: [
    "[you all | y'all | yall] [walk | are walking | do walk] [in | on] the field with the girl.",
    "[you all | y'all | yall] [walk | are walking | do walk] with the girl [in | on] the field.",
    "With the girl [you all | y'all | yall] [walk | are walking | do walk] [in | on] the field.",
  ],
  s172: [
    "I [give | am giving | do give] a [reward | prize | gift] to the good man, but you [prepare | are preparing | do prepare | design | are designing | do design] a [bad | evil | wicked] [trick | trickery | deception | deceit].",
    "I [give | am giving | do give] the good man a [reward | prize | gift], but you [prepare | are preparing | do prepare | design | are designing | do design] a [bad | evil | wicked] [trick | trickery | deception | deceit].",
  ],
  s173: [
    "[you all | y'all | yall] [give | are giving | do give] a good [reward | prize | gift] to (the | your) son.",
    "[you all | y'all | yall] [give | are giving | do give] (the | your) son a good [reward | prize | gift].",
  ],
  s174: [
    "I [think about | am thinking about | do think about | think of | am thinking of | do think of | consider | am considering | do consider | ponder | am pondering | do ponder] (the) [family | household], but you [think about | are thinking about | do think about | think of | are thinking of | do think of | consider | are considering | do consider | ponder | are pondering | do ponder] (the) war.",
    "I [think about | am thinking about | do think about | think of | am thinking of | do think of | consider | am considering | do consider | ponder | am pondering | do ponder] (the) [family | household], and you, however, [think about | are thinking about | do think about | think of | are thinking of | do think of | consider | are considering | do consider | ponder | are pondering | do ponder] (the) war.",
  ],
  s175: [
    "[you all | y'all | yall] [have | are having | do have] many long [letters | epistles].",
  ],
  s176: [
    "You [remain | are remaining | do remain | stay | are staying | do stay] in the [cottage | little house | house], but the boys [lie | are lying | do lie | lie down | are lying down | do lie down] in the field.",
    "You [remain | are remaining | do remain | stay | are staying | do stay] in the [cottage | little house | house]; the boys, however, [lie | are lying | do lie | lie down | are lying down | do lie down] in the field.",
  ],
  s177: [
    "A good book [strengthens | is strengthening | does strengthen | fortifies | is fortifying | does fortify | reinforces | is reinforcing | does reinforce] the [mind | spirit | soul].",
  ],
  s178: [
    "[you all | y'all | yall] [often hold | are often holding | do often hold | frequently hold | are frequently holding | do frequently hold] (the) books.",
    "[you all | y'all | yall] [hold | are holding | do hold] (the) books [often | frequently].",
    "[often | frequently] [you all | y'all | yall] [hold | are holding | do hold] (the) books.",
  ],
  s179: [
    "The [mistress's | mistress' | lady's] eyes are [beautiful | nice | lovely | pretty]; [and so | so | therefore | and therefore] you [envy | are envying | do envy | are jealous of | are envious of] the [mistress | lady].",
    "The eyes of the [mistress | lady] are [beautiful | nice | lovely | pretty]; [and so | so | therefore | and therefore] you [envy | are envying | do envy | are jealous of | are envious of] the [mistress | lady].",
  ],
  s180: [
    "We [regard | are regarding | do regard | esteem | are esteeming | do esteem | admire | are admiring | do admire | value | are valuing | do value | think highly of | think highly | are thinking highly of | are thinking highly | do think highly of | do think highly] the [serious | strict | severe | stern | harsh] old man.",
  ],
  s181: [
    "[you all | y'all | yall] [always love | are always loving | do always love] (the) peace.",
    "[you all | y'all | yall] [love | are loving | do love] (the) peace always.",
    "Always [you all | y'all | yall] [love | are loving | do love] (the) peace.",
  ],
  s182: [
    "I [fear | am fearing | do fear | am afraid of | am scared of] the king, but you [do not fear | are not fearing | are not afraid of | are not scared of] the [leader | general | commander].",
    "I [fear | am fearing | do fear | am afraid of | am scared of] the king; you, however, [do not fear | are not fearing | are not afraid of | are not scared of] the [leader | general | commander].",
  ],
  s183: [
    "[you all | y'all | yall] [free | are freeing | do free | liberate | are liberating | do liberate | set free | are setting free | do set free] (the) [people | men | human beings | humans] from (the) fear.",
  ],
  s184: [
    "I [believe | am believing | do believe | trust | am trusting | do trust] the consul, but you [do not believe | are not believing | do not trust | are not trusting] the woman.",
    "I [believe | am believing | do believe | trust | am trusting | do trust] the consul; you, however, [do not believe | are not believing | do not trust | are not trusting] the woman.",
  ],
  s185: [
    "We [come | are coming | do come] [from | out of] the city, but [you all | y'all | yall] [come | are coming | do come] [to | toward | towards] the sea.",
    "We [come | are coming | do come] [from | out of] the city; [you all | y'all | yall], however, [come | are coming | do come] [to | toward | towards] the sea.",
  ],
  s186: [
    "I [do not fear | am not fearing | am not afraid of | am not scared of] the [enemy | foe], but you [flee | are fleeing | do flee | run away | are running away | do run away].",
  ],
  s187: [
    "[you all | y'all | yall] [fight | are fighting | do fight] with the [brave | strong | courageous] soldiers.",
    "With the [brave | strong | courageous] soldiers [you all | y'all | yall] [fight | are fighting | do fight].",
  ],
  s188: [
    "I too [was loving | used to love] Aeneas.",
    "I [was loving | used to love] Aeneas too.",
  ],
  s189: [
    "[were you all | were y'all | were yall] [afraid of | scared of | fearing] the [storm | tempest] Trojans?",
    "Trojans [were you all | were y'all | were yall] [afraid of | scared of | fearing] the [storm | tempest]?",
  ],
  s190: [
    "[you all | y'all | yall] [fear | are fearing | do fear | are afraid of | are scared of] (the) [fire | flames], but (the) Romans [do not fear | are not fearing | are not afraid of | are not scared of] (the) [fire | flames].",
  ],
  s191: [
    "I [have | am having | do have | possess | do possess | own | do own] nothing, but you [have | are having | do have | possess | do possess | own | do own] [everything | all things | all].",
    "I [do not have | am not having | do not possess | do not own] anything, but you [have | are having | do have | possess | do possess | own | do own] [everything | all things | all].",
  ],
  s192: [
    "We are [at the house of | at the home of | with | at | near | beside] the judge, but [you all | y'all | yall] are at home.",
    "We are at the [judge's | judge] [house | home | place], but [you all | y'all | yall] are at home.",
  ],
  s193: [
    "You [will wait for | will await | will expect | will be waiting for | will be awaiting | will be expecting] me [near | near to | close to | next to] the tree.",
    "[near | near to | close to | next to] the tree you [will wait for | will await | will expect | will be waiting for | will be awaiting | will be expecting] me.",
  ],
  s194: [
    "[you | you all | y'all | yall] parents [will not be able to | will be unable to] [separate | part | divide] us.",
  ],
  s195: [
    "Together we [will spend | shall spend | will pass | shall pass | will live out | shall live out | will live through | shall live through | will lead | shall lead | will be spending | shall be spending | will be passing | shall be passing | will be living out | shall be living out | will be living through | shall be living through | will be leading | shall be leading] (our | the) old age in a [country | rural | rustic] [villa | estate | house | home].",
    "We [will spend | shall spend | will pass | shall pass | will live out | shall live out | will live through | shall live through | will lead | shall lead | will be spending | shall be spending | will be passing | shall be passing | will be living out | shall be living out | will be living through | shall be living through | will be leading | shall be leading] (our | the) old age together in a [country | rural | rustic] [villa | estate | house | home].",
    "Together in a [country | rural | rustic] [villa | estate | house | home] we [will spend | shall spend | will pass | shall pass | will live out | shall live out | will live through | shall live through | will lead | shall lead | will be spending | shall be spending | will be passing | shall be passing | will be living out | shall be living out | will be living through | shall be living through | will be leading | shall be leading] (our | the) old age.",
  ],
  s196: [
    "Why do [you all | y'all | yall] [neglect | disregard | ignore] your [villa | country house | country home | estate]?",
    "Why are [you all | y'all | yall] [neglecting | disregarding | ignoring] your [villa | country house | country home | estate]?",
  ],
  s197: [
    "[did you see | have you seen] a [large | great | big] cloud in [the sky | heaven | the heaven | the heavens]?",
    "In [the sky | heaven | the heaven | the heavens] [did you see | have you seen] a [large | great | big] cloud?",
  ],
  s198: [
    "[you all | y'all | yall] [saved | did save | have saved | preserved | did preserve | have preserved | rescued | did rescue | have rescued | protected | did protect | have protected] (the | your) mother and (the | your) sister.",
  ],
  s199: [
    "I had [heard | listened to] the [uproar | confusion | tumult | noise], but you had heard nothing.",
    "I had [heard | listened to] the [uproar | confusion | tumult | noise], but you had not heard anything.",
    "I had [heard | listened to] the [uproar | confusion | tumult | noise]; you, however, had heard nothing.",
  ],
  s200: [
    "[you all | y'all | yall] had not been in the city.",
  ],
  s201: [
    "If I [see | have seen | will have seen] [my | the] husband, I [will love | shall love | will be loving | shall be loving] him.",
    "I [will love | shall love | will be loving | shall be loving] him if I [see | have seen | will have seen] [my | the] husband.",
  ],
  s202: [
    "If we [lose | have lost | will have lost] [our | the] son, we [will feel pain | shall feel pain | will be hurt | shall be hurt | will be in pain | shall be in pain | will suffer | shall suffer | will grieve | shall grieve | will be feeling pain | shall be feeling pain | will be suffering | shall be suffering | will be grieving | shall be grieving].",
    "We [will feel pain | shall feel pain | will be hurt | shall be hurt | will be in pain | shall be in pain | will suffer | shall suffer | will grieve | shall grieve | will be feeling pain | shall be feeling pain | will be suffering | shall be suffering | will be grieving | shall be grieving] if we [lose | have lost | will have lost] [our | the] son.",
  ],
  s203: [
    "If [you all | y'all | yall] [wake | wake up | awaken | rouse | stir up | have woken | have woken up | have awakened | have roused | have stirred up | will have woken | will have woken up | will have awakened | will have roused | will have stirred up] [your | the] husband, he will [flee | run away].",
    "If [you all | y'all | yall] [wake | have woken | will have woken | stir | have stirred | will have stirred] [your | the] husband up, he will [flee | run away].",
    "He will [flee | run away] if [you all | y'all | yall] [wake | wake up | awaken | rouse | stir up | have woken | have woken up | have awakened | have roused | have stirred up | will have woken | will have woken up | will have awakened | will have roused | will have stirred up] [your | the] husband.",
  ],
  s204: [
    "I [was wounded | have been wounded | was injured | have been injured] in [the battle | battle | combat | the combat], but you [were saved | have been saved | were rescued | have been rescued | were preserved | have been preserved] by a soldier.",
    "In [the battle | battle | combat | the combat] I [was wounded | have been wounded | was injured | have been injured], but you [were saved | have been saved | were rescued | have been rescued | were preserved | have been preserved] by a soldier.",
  ],
  s205: [
    "We [were defeated | have been defeated | were conquered | have been conquered | were beaten | have been beaten | were overcome | have been overcome] by (the) Huns, but [you all | y'all | yall] [fled | did flee | have fled | ran away | did run away | have run away].",
  ],
  s206: [
    "I [took | have taken | did take | captured | have captured | did capture | seized | have seized | did seize] (the) [fruit | fruits], but you [did not take | have not taken | did not capture | have not captured | did not seize | have not seized] (the) [fruit | fruits].",
  ],
  s207: [
    "[you all | y'all | yall] [took | have taken | did take | captured | have captured | did capture | seized | have seized | did seize] (the) [fruit | fruits] [from | out of] the tree.",
    "[from | out of] the tree [you all | y'all | yall] [took | have taken | did take | captured | have captured | did capture | seized | have seized | did seize] (the) [fruit | fruits].",
  ],
  s208: [
    "You [see | are seeing | do see] [Fortune's | Fortuna's] wheel, but you [do not understand | are not understanding | do not comprehend | are not comprehending] (it).",
    "You [see | are seeing | do see] the wheel of [Fortune | Fortuna], but you [do not understand | are not understanding | do not comprehend | are not comprehending] (it).",
  ],
  s209: [
    "[you all | y'all | yall] [do not possess | do not own | do not have] (the) [external | outward] [things | matters | affairs] [for certain | for sure | with certainty | certainly].",
    "[for certain | for sure | with certainty | certainly] [you all | y'all | yall] [do not possess | do not own | do not have] (the) [external | outward] [things | matters | affairs].",
  ],
};
