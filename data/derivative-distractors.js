// Wrong answers for Derivative Practice, by first letter: everyday,
// school-appropriate English words that don't come from Latin (mostly Old
// English and Norse), so none can be a derivative of the word being asked
// about. English has few such words starting with q, v, or j; the v list adds
// a few from Latin words that aren't in either book (volcano, violet, valley).
export const DISTRACTORS = {
  a: ['apple', 'arrow', 'answer', 'ant', 'awake', 'awkward', 'acorn', 'alive', 'alone', 'anvil', 'axe', 'asleep', 'ask', 'awful', 'ankle', 'aspen', 'axle', 'alder'],
  b: ['bake', 'bark', 'barn', 'bath', 'bead', 'bean', 'bed', 'bee', 'bell', 'bench', 'berry', 'bird', 'bite', 'blade', 'bleed', 'blink', 'bloom', 'blossom', 'boat', 'bone', 'book', 'bowl', 'brain', 'bread', 'bridge', 'bright', 'brook', 'broom', 'brown', 'bubble', 'build', 'bundle', 'burn', 'busy', 'buy', 'banana'],
  c: ['calf', 'carve', 'cheek', 'chew', 'chicken', 'child', 'chin', 'chirp', 'choose', 'clay', 'clean', 'cliff', 'climb', 'cloth', 'cloud', 'clover', 'coal', 'cold', 'comb', 'corn', 'cow', 'crab', 'cradle', 'craft', 'crawl', 'crib', 'crow', 'crumb', 'curl'],
  d: ['daisy', 'dark', 'dawn', 'deaf', 'deep', 'deer', 'den', 'dew', 'dig', 'dim', 'dip', 'ditch', 'dive', 'dizzy', 'dog', 'door', 'dough', 'dove', 'drag', 'dream', 'drink', 'drip', 'drop', 'drum', 'dry', 'duck', 'dust', 'dwarf'],
  e: ['ear', 'early', 'earn', 'earth', 'east', 'eat', 'edge', 'eel', 'egg', 'eight', 'elbow', 'elk', 'elm', 'ember', 'empty', 'end', 'errand', 'evening', 'eye'],
  f: ['far', 'fast', 'feather', 'feed', 'fern', 'fight', 'find', 'finger', 'fish', 'fist', 'flag', 'flat', 'flea', 'flight', 'float', 'flock', 'flood', 'floor', 'fly', 'foam', 'fog', 'folk', 'foot', 'fox', 'freeze', 'frog', 'frost'],
  g: ['gate', 'gather', 'gift', 'give', 'glad', 'glass', 'glove', 'glow', 'gnat', 'goat', 'gold', 'good', 'goose', 'grass', 'gray', 'green', 'grin', 'grip', 'ground', 'grow', 'guess', 'gull', 'gust'],
  h: ['hair', 'hall', 'hammer', 'happy', 'harbor', 'hard', 'harvest', 'hat', 'hatch', 'hawk', 'hay', 'hedge', 'heel', 'hen', 'herd', 'hill', 'hint', 'hive', 'hole', 'honey', 'hook', 'hop', 'horn', 'hug', 'hum', 'hunt'],
  i: ['ice', 'icicle', 'idle', 'inn', 'iron', 'itch', 'ivy', 'island', 'igloo', 'iceberg'],
  j: ['jump', 'jungle', 'jacket', 'jaguar', 'jar', 'jazz', 'jeans', 'jog', 'jigsaw', 'jolly'],
  k: ['keel', 'keen', 'keep', 'key', 'kick', 'kid', 'kind', 'king', 'kite', 'knee', 'knife', 'knit', 'knob', 'knock', 'knot', 'know'],
  l: ['ladder', 'lamb', 'land', 'lap', 'lark', 'laugh', 'leaf', 'leap', 'learn', 'leather', 'leg', 'lid', 'lift', 'light', 'limb', 'lip', 'listen', 'little', 'loaf', 'lock', 'log', 'look', 'loud', 'luck', 'lump'],
  m: ['make', 'maple', 'marsh', 'meadow', 'meal', 'melt', 'mild', 'milk', 'mist', 'mole', 'moon', 'moth', 'mouse', 'mud', 'muddy', 'murky'],
  n: ['nail', 'narrow', 'neck', 'needle', 'nest', 'net', 'nettle', 'nimble', 'nod', 'north', 'nose', 'nut', 'nap', 'nag'],
  o: ['oak', 'oar', 'oats', 'oath', 'orchard', 'otter', 'oven', 'owl', 'ox', 'often', 'outside'],
  p: ['path', 'pebble', 'penny', 'play', 'plow', 'pond', 'pool', 'puddle', 'pull', 'plump', 'poke', 'puff', 'pickle', 'popcorn', 'puzzle', 'pig', 'peck'],
  q: ['queen', 'quick', 'quack', 'quake', 'quench', 'quiz', 'quirk', 'quiver', 'quill'],
  r: ['rain', 'rainbow', 'rake', 'ram', 'rat', 'raven', 'read', 'red', 'reed', 'rib', 'riddle', 'ride', 'ring', 'roof', 'room', 'root', 'rope', 'rough', 'rub', 'run', 'rust', 'rye'],
  s: ['sail', 'sand', 'shadow', 'sheep', 'shell', 'shine', 'ship', 'shirt', 'shoe', 'shore', 'shoulder', 'shovel', 'sing', 'skin', 'sky', 'sled', 'sleeve', 'slide', 'slow', 'smile', 'smoke', 'snail', 'snake', 'snow', 'soap', 'soft', 'song', 'sour', 'south', 'spider', 'spoon', 'spring', 'stone', 'storm', 'straw', 'string', 'summer', 'swan', 'swim'],
  t: ['tail', 'tall', 'teach', 'teeth', 'thick', 'thin', 'thimble', 'thorn', 'thread', 'throat', 'thumb', 'thunder', 'tide', 'tin', 'toad', 'toe', 'tooth', 'toy', 'tub', 'tulip', 'twig', 'twin'],
  u: ['udder', 'ugly', 'under', 'unfold', 'unhappy', 'unkind', 'untie', 'uproot', 'upset', 'upstairs', 'upward', 'utter'],
  v: ['vat', 'vane', 'viking', 'van', 'vanilla', 'volcano', 'violet', 'velvet', 'valley', 'vase', 'vapor', 'vulture', 'vegetable', 'violin', 'valve', 'veil'],
  w: ['wagon', 'waist', 'walk', 'wand', 'warm', 'wash', 'wasp', 'watch', 'wave', 'wax', 'weave', 'web', 'wedge', 'weed', 'week', 'well', 'west', 'wet', 'whale', 'wheat', 'whisker', 'whisper', 'whistle', 'wide', 'wild', 'willow', 'window', 'wing', 'winter', 'wire', 'wise', 'wood', 'wool', 'worm', 'wrist'],
  y: ['yard', 'yarn', 'yawn', 'yell', 'yellow', 'yesterday', 'yolk', 'yak'],
  z: ['zebra', 'zero', 'zigzag', 'zip', 'zinc', 'zoo'],
};
