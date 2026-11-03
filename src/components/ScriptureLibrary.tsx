import React, { useState } from 'react';
import { Search, Music, BookOpen, Clock } from 'lucide-react';
import { scriptures as scripturesData } from '../data/scriptures';

interface ScriptureLibraryProps {
  onSelectScripture: (scripture: any) => void;
}

export function ScriptureLibrary({ onSelectScripture }: ScriptureLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const scriptures = scripturesData.length > 0 ? scripturesData : [
    {
      id: 'psalm23',
      reference: 'Psalm 23:1-6',
      title: 'The Lord is My Shepherd',
      theme: 'Comfort and Trust',
      key: 'D Major',
      tempo: 'Andante',
      duration: '3:45',
      difficulty: 'Beginner',
      text: 'Psalms:23:1: The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his names sake. Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me. Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over. Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.',
      category: 'psalms'
    },
    {
      id: 'john3:16',
      reference: 'John 3:16',
      title: 'For God So Loved the World',
      theme: 'Love and Salvation',
      key: 'G Major',
      tempo: 'Moderato',
      duration: '2:30',
      difficulty: 'Beginner',
      text: ' For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      category: 'gospels'
    },
    {
      id: 'isaiah4031',
      reference: 'Isaiah 40:31',
      title: 'They That Wait Upon the Lord',
      theme: 'Strength and Hope',
      key: 'F Major',
      tempo: 'Allegro',
      duration: '2:15',
      difficulty: 'Intermediate',
      text: 'Isa:40:31: But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
      category: 'prophets'
    },
        {
      id: 'psalm27:1-14',
      reference: 'Psalm 27:1-14',
      title: 'The Lord Is My Light and My Salvation',
      theme: 'Waiting on the Lords Salvation',
      key: 'D Minor',
      tempo: 'Allegro',
      duration: '4:30',
      difficulty: 'Intermediate',
      text: 'Psalms:27:1-14 The LORD is my light and my salvation; whom shall I fear?  the LORD is the strength of my life; of whom shall I be afraid? When the wicked, even mine enemies and my foes, came upon me to eat up my flesh, they stumbled and fell. Though an host should encamp against me, my heart shall not fear: though war should rise against me, in this will I be confident. One thing have I desired of the LORD, that will I seek after; that I may dwell in the house of the LORD all the days of my life, to behold the beauty of the LORD, and to enquire in his temple. For in the time of trouble he shall hide me in his pavilion: in the secret of his tabernacle shall he hide me; he shall set me up upon a rock. And now shall mine head be lifted up above mine enemies round about me: therefore will I offer in his tabernacle sacrifices of joy; I will sing, yea, I will sing praises unto the LORD. Hear, O LORD, when I cry with my voice: have mercy also upon me, and answer me. When thou saidst, Seek ye my face; my heart said unto thee, Thy face, LORD, will I seek. Hide not thy face far from me; put not thy servant away in anger: thou hast been my help; leave me not, neither forsake me, O God of my salvation. When my father and my mother forsake me, then the LORD will take me up. Teach me thy way, O LORD, and lead me in a plain path, because of mine enemies. Deliver me not over unto the will of mine enemies: for false witnesses are risen up against me, and such as breathe out cruelty. I had fainted, unless I had believed to see the goodness of the LORD in the land of the living. Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.',
      category: 'psalms'
    },
            {
      id: 'proverbs3:5-6',
      reference: 'Proverbs 3:5-6',
      title: 'Trust In the Lord',
      theme: 'God directs our paths',
      key: 'Eb Major',
      tempo: 'Allegro',
      duration: '1:00',
      difficulty: 'Intermediate',
      text: 'Proverb:3:5: Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
      category: 'psalms'
    },
    {
  id: 'proverbs3',
  reference: 'Proverbs 3:1-35',
  title: 'Wisdom and Guidance',
  theme: 'Wisdom and Obedience',
  key: 'C Major',
  tempo: 'Allegro',
  duration: '5:00',
  difficulty: 'Intermediate',
  text: 'Proverb:3:1: My son, forget not my law; but let thine heart keep my commandments:\nProverb:3:2: For length of days, and long life, and peace, shall they add to thee.\nProverb:3:3: Let not mercy and truth forsake thee: bind them about thy neck; write them upon the table of thine heart:\nProverb:3:4: So shalt thou find favour and good understanding in the sight of God and man.\nProverb:3:5: Trust in the LORD with all thine heart; and lean not unto thine own understanding.\nProverb:3:6: In all thy ways acknowledge him, and he shall direct thy paths.\nProverb:3:7: Be not wise in thine own eyes: fear the LORD, and depart from evil.\nProverb:3:8: It shall be health to thy navel, and marrow to thy bones.\nProverb:3:9: Honour the LORD with thy substance, and with the firstfruits of all thine increase:\nProverb:3:10: So shall thy barns be filled with plenty, and thy presses shall burst out with new wine.\nProverb:3:11: My son, despise not the chastening of the LORD; neither be weary of his correction:\nProverb:3:12: For whom the LORD loveth he correcteth; even as a father the son in whom he delighteth.\nProverb:3:13: Happy is the man that findeth wisdom, and the man that getteth understanding.\nProverb:3:14: For the merchandise of it is better than the merchandise of silver, and the gain thereof than fine gold.\nProverb:3:15: She is more precious than rubies: and all the things thou canst desire are not to be compared unto her.\nProverb:3:16: Length of days is in her right hand; and in her left hand riches and honour.\nProverb:3:17: Her ways are ways of pleasantness, and all her paths are peace.\nProverb:3:18: She is a tree of life to them that lay hold upon her: and happy is every one that retaineth her.\nProverb:3:19: The LORD by wisdom hath founded the earth; by understanding hath he established the heavens.\nProverb:3:20: By his knowledge the depths are broken up, and the clouds drop down the dew.\nProverb:3:21: My son, let not them depart from thine eyes: keep sound wisdom and discretion:\nProverb:3:22: So shall they be life unto thy soul, and grace to thy neck.\nProverb:3:23: Then shalt thou walk in thy way safely, and thy foot shall not stumble.\nProverb:3:24: When thou liest down, thou shalt not be afraid: yea, thou shalt lie down, and thy sleep shall be sweet.\nProverb:3:25: Be not afraid of sudden fear, neither of the desolation of the wicked, when it cometh.\nProverb:3:26: For the LORD shall be thy confidence, and shall keep thy foot from being taken.\nProverb:3:27: Withhold not good from them to whom it is due, when it is in the power of thine hand to do it.\nProverb:3:28: Say not unto thy neighbour, Go, and come again, and to morrow I will give; when thou hast it by thee.\nProverb:3:29: Devise not evil against thy neighbour, seeing he dwelleth securely by thee.\nProverb:3:30: Strive not with a man without cause, if he have done thee no harm.\nProverb:3:31: Envy thou not the oppressor, and choose none of his ways.\nProverb:3:32: For the froward is abomination to the LORD: but his secret is with the righteous.\nProverb:3:33: The curse of the LORD is in the house of the wicked: but he blesseth the habitation of the just.\nProverb:3:34: Surely he scorneth the scorners: but he giveth grace unto the lowly.\nProverb:3:35: The wise shall inherit glory: but shame shall be the promotion of fools.',
  category: 'proverbs'
},
{
  id: 'genesis1',
  reference: 'Genesis 1:1-31',
  title: 'Creation Story',
  theme: 'Creation and Beginnings',
  key: 'D Major',
  tempo: 'Andante',
  duration: '6:30',
  difficulty: 'Advanced',
  text: 'Genesis:1:1: In the beginning God created the heaven and the earth.\nGenesis:1:2: And the earth was without form, and void; and darkness was upon the face of the deep.  And the Spirit of God moved upon the face of the waters.\nGenesis:1:3: And God said, Let there be light: and there was light.\nGenesis:1:4: And God saw the light, that it was good: and God divided the light from the darkness.\nGenesis:1:5: And God called the light Day, and the darkness he called Night.  And the evening and the morning were the first day.\nGenesis:1:6: And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.\nGenesis:1:7: And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.\nGenesis:1:8: And God called the firmament Heaven.  And the evening and the morning were the second day.\nGenesis:1:9: And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.\nGenesis:1:10: And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.\nGenesis:1:11: And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so.\nGenesis:1:12: And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good.\nGenesis:1:13: And the evening and the morning were the third day.\nGenesis:1:14: And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:\nGenesis:1:15: And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.\nGenesis:1:16: And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also.\nGenesis:1:17: And God set them in the firmament of the heaven to give light upon the earth,\nGenesis:1:18: And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good.\nGenesis:1:19: And the evening and the morning were the fourth day.\nGenesis:1:20: And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven.\nGenesis:1:21: And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good.\nGenesis:1:22: And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth.\nGenesis:1:23: And the evening and the morning were the fifth day.\nGenesis:1:24: And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so.\nGenesis:1:25: And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good.\nGenesis:1:26: And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.\nGenesis:1:27: So God created man in his own image, in the image of God created he him; male and female created he them.\nGenesis:1:28: And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth.\nGenesis:1:29: And God said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat.\nGenesis:1:30: And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so.\nGenesis:1:31: And God saw every thing that he had made, and, behold, it was very good.  And the evening and the morning were the sixth day.',
  category: 'genesis'
},
{
  id: 'exodus20',
  reference: 'Exodus 20:1-17',
  title: 'The Ten Commandments',
  theme: 'Law and Commandments',
  key: 'Eb Major',
  tempo: 'Moderato',
  duration: '4:15',
  difficulty: 'Intermediate',
  text: 'Ex:20:1: And God spake all these words, saying,\nEx:20:2: I am the LORD thy God, which have brought thee out of the land of Egypt, out of the house of bondage.\nEx:20:3: Thou shalt have no other gods before me.\nEx:20:4: Thou shalt not make unto thee any graven image, or any likeness of any thing that is in heaven above, or that is in the earth beneath, or that is in the water under the earth:\nEx:20:5: Thou shalt not bow down thyself to them, nor serve them: for I the LORD thy God am a jealous God, visiting the iniquity of the fathers upon the children unto the third and fourth generation of them that hate me;\nEx:20:6: And shewing mercy unto thousands of them that love me, and keep my commandments.\nEx:20:7: Thou shalt not take the name of the LORD thy God in vain; for the LORD will not hold him guiltless that taketh his name in vain.\nEx:20:8: Remember the sabbath day, to keep it holy.\nEx:20:9: Six days shalt thou labour, and do all thy work:\nEx:20:10: But the seventh day is the sabbath of the LORD thy God: in it thou shalt not do any work, thou, nor thy son, nor thy daughter, thy manservant, nor thy maidservant, nor thy cattle, nor thy stranger that is within thy gates:\nEx:20:11: For in six days the LORD made heaven and earth, the sea, and all that in them is, and rested the seventh day: wherefore the LORD blessed the sabbath day, and hallowed it.\nEx:20:12: Honour thy father and thy mother: that thy days may be long upon the land which the LORD thy God giveth thee.\nEx:20:13: Thou shalt not kill.\nEx:20:14: Thou shalt not commit adultery.\nEx:20:15: Thou shalt not steal.\nEx:20:16: Thou shalt not bear false witness against thy neighbour.\nEx:20:17: Thou shalt not covet thy neighbour\'s house, thou shalt not covet thy neighbour\'s wife, nor his manservant, nor his maidservant, nor his ox, nor his ass, nor any thing that is thy neighbour\'s.',
  category: 'exodus'
},
{
  id: 'leviticus16',
  reference: 'Leviticus 16:1-34',
  title: 'Day of Atonement',
  theme: 'Atonement and Forgiveness',
  key: 'F Major',
  tempo: 'Grave',
  duration: '7:00',
  difficulty: 'Advanced',
  text: 'Le:16:2: And the LORD said unto Moses, Speak unto Aaron thy brother, that he come not at all times into the holy place within the vail before the mercy seat, which is upon the ark; that he die not: for I will appear in the cloud upon the mercy seat.\nLe:16:3: Thus shall Aaron come into the holy place: with a young bullock for a sin offering, and a ram for a burnt offering.\nLe:16:4: He shall put on the holy linen coat, and he shall have the linen breeches upon his flesh, and shall be girded with a linen girdle, and with the linen mitre shall he be attired: these are holy garments; therefore shall he wash his flesh in water, and so put them on.\nLe:16:5: And he shall take of the congregation of the children of Israel two kids of the goats for a sin offering, and one ram for a burnt offering.\nLe:16:6: And Aaron shall offer his bullock of the sin offering, which is for himself, and make an atonement for himself, and for his house.\nLe:16:7: And he shall take the two goats, and present them before the LORD at the door of the tabernacle of the congregation.\nLe:16:8: And Aaron shall cast lots upon the two goats; one lot for the LORD, and the other lot for the scapegoat.\nLe:16:9: And Aaron shall bring the goat upon which the LORD\'s lot fell, and offer him for a sin offering.\nLe:16:10: But the goat, on which the lot fell to be the scapegoat, shall be presented alive before the LORD, to make an atonement with him, and to let him go for a scapegoat into the wilderness.\nLe:16:11: And Aaron shall bring the bullock of the sin offering, which is for himself, and shall make an atonement for himself, and for his house, and shall kill the bullock of the sin offering which is for himself:\nLe:16:12: And he shall take a censer full of burning coals of fire from off the altar before the LORD, and his hands full of sweet incense beaten small, and bring it within the vail:\nLe:16:13: And he shall put the incense upon the fire before the LORD, that the cloud of the incense may cover the mercy seat that is upon the testimony, that he die not:\nLe:16:14: And he shall take of the blood of the bullock, and sprinkle it with his finger upon the mercy seat eastward; and before the mercy seat shall he sprinkle of the blood with his finger seven times.\nLe:16:15: Then shall he kill the goat of the sin offering, that is for the people, and bring his blood within the vail, and do with that blood as he did with the blood of the bullock, and sprinkle it upon the mercy seat, and before the mercy seat:\nLe:16:16: And he shall make an atonement for the holy place, because of the uncleanness of the children of Israel, and because of their transgressions in all their sins: and so shall he do for the tabernacle of the congregation, that remaineth among them in the midst of their uncleanness.\nLe:16:17: And there shall be no man in the tabernacle of the congregation when he goeth in to make an atonement in the holy place, until he come out, and have made an atonement for himself, and for his household, and for all the congregation of Israel.\nLe:16:18: And he shall go out unto the altar that is before the LORD, and make an atonement for it; and shall take of the blood of the bullock, and of the blood of the goat, and put it upon the horns of the altar round about.\nLe:16:19: And he shall sprinkle of the blood upon it with his finger seven times, and cleanse it, and hallow it from the uncleanness of the children of Israel.\nLe:16:20: And when he hath made an end of reconciling the holy place, and the tabernacle of the congregation, and the altar, he shall bring the live goat:\nLe:16:21: And Aaron shall lay both his hands upon the head of the live goat, and confess over him all the iniquities of the children of Israel, and all their transgressions in all their sins, putting them upon the head of the goat, and shall send him away by the hand of a fit man into the wilderness:\nLe:16:22: And the goat shall bear upon him all their iniquities unto a land not inhabited: and he shall let go the goat in the wilderness.\nLe:16:23: And Aaron shall come into the tabernacle of the congregation, and shall put off the linen garments, which he put on when he went into the holy place, and shall leave them there:\nLe:16:24: And he shall wash his flesh with water in the holy place, and put on his garments, and come forth, and offer his burnt offering, and the burnt offering of the people, and make an atonement for himself, and for the people.\nLe:16:25: And the fat of the sin offering shall he burn upon the altar.\nLe:16:26: And he that let go the goat for the scapegoat shall wash his clothes, and bathe his flesh in water, and afterward come into the camp.\nLe:16:27: And the bullock for the sin offering, and the goat for the sin offering, whose blood was brought in to make an atonement in the holy place, shall one carry forth without the camp; and they shall burn in the fire their skins, and their flesh, and their dung.\nLe:16:28: And he that burneth them shall wash his clothes, and bathe his flesh in water, and afterward he shall come into the camp.\nLe:16:29: And this shall be a statute for ever unto you: that in the seventh month, on the tenth day of the month, ye shall afflict your souls, and do no work at all, whether it be one of your own country, or a stranger that sojourneth among you:\nLe:16:30: For on that day shall the priest make an atonement for you, to cleanse you, that ye may be clean from all your sins before the LORD.\nLe:16:31: It shall be a sabbath of rest unto you, and ye shall afflict your souls, by a statute for ever.\nLe:16:32: And the priest, whom he shall anoint, and whom he shall consecrate to minister in the priest\'s office in his father\'s stead, shall make the atonement, and shall put on the linen clothes, even the holy garments:\nLe:16:33: And he shall make an atonement for the holy sanctuary, and he shall make an atonement for the tabernacle of the congregation, and for the altar, and he shall make an atonement for the priests, and for all the people of the congregation.\nLe:16:34: And this shall be an everlasting statute unto you, to make an atonement for the children of Israel for all their sins once a year.  And he did as the LORD commanded Moses.',
  category: 'leviticus'
},
{
  id: 'deuteronomy32',
  reference: 'Deuteronomy 32:1-43',
  title: 'Moses\' Song of Admonition',
  theme: 'Admonition and Faithfulness',
  key: 'A Minor',
  tempo: 'Largo',
  duration: '8:00',
  difficulty: 'Advanced',
  text: 'De:32:1: Give ear, O ye heavens, and I will speak; and hear, O earth, the words of my mouth.\nDe:32:2: My doctrine shall drop as the rain, my speech shall distil as the dew, as the small rain upon the tender herb, and as the showers upon the grass:\nDe:32:3: Because I will publish the name of the LORD: ascribe ye greatness unto our God.\nDe:32:4: He is the Rock, his work is perfect: for all his ways are judgment: a God of truth and without iniquity, just and right is he.\nDe:32:5: They have corrupted themselves, their spot is not the spot of his children: they are a perverse and crooked generation.\nDe:32:6: Do ye thus requite the LORD, O foolish people and unwise?  is not he thy father that hath bought thee?  hath he not made thee, and established thee?\nDe:32:7: Remember the days of old, consider the years of many generations: ask thy father, and he will shew thee; thy elders, and they will tell thee.\nDe:32:8: When the most High divided to the nations their inheritance, when he separated the sons of Adam, he set the bounds of the people according to the number of the children of Israel.\nDe:32:9: For the LORD\'s portion is his people; Jacob is the lot of his inheritance.\nDe:32:10: He found him in a desert land, and in the waste howling wilderness; he led him about, he instructed him, he kept him as the apple of his eye.\nDe:32:11: As an eagle stirreth up her nest, fluttereth over her young, spreadeth abroad her wings, taketh them, beareth them on her wings:\nDe:32:12: So the LORD alone did lead him, and there was no strange god with him.\nDe:32:13: He made him ride on the high places of the earth, that he might eat the increase of the fields; and he made him to suck honey out of the rock, and oil out of the flinty rock;\nDe:32:14: Butter of kine, and milk of sheep, with fat of lambs, and rams of the breed of Bashan, and goats, with the fat of kidneys of wheat; and thou didst drink the pure blood of the grape.\nDe:32:15: But Jeshurun waxed fat, and kicked: thou art waxen fat, thou art grown thick, thou art covered with fatness; then he forsook God which made him, and lightly esteemed the Rock of his salvation.\nDe:32:16: They provoked him to jealousy with strange gods, with abominations provoked they him to anger.\nDe:32:17: They sacrificed unto devils, not to God; to gods whom they knew not, to new gods that came newly up, whom your fathers feared not.\nDe:32:18: Of the Rock that begat thee thou art unmindful, and hast forgotten God that formed thee.\nDe:32:19: And when the LORD saw it, he abhorred them, because of the provoking of his sons, and of his daughters.\nDe:32:20: And he said, I will hide my face from them, I will see what their end shall be: for they are a very froward generation, children in whom is no faith.\nDe:32:21: They have moved me to jealousy with that which is not God; they have provoked me to anger with their vanities: and I will move them to jealousy with those which are not a people; I will provoke them to anger with a foolish nation.\nDe:32:22: For a fire is kindled in mine anger, and shall burn unto the lowest hell, and shall consume the earth with her increase, and set on fire the foundations of the mountains.\nDe:32:23: I will heap mischiefs upon them; I will spend mine arrows upon them.\nDe:32:24: They shall be burnt with hunger, and devoured with burning heat, and with bitter destruction: I will also send the teeth of beasts upon them, with the poison of serpents of the dust.\nDe:32:25: The sword without, and terror within, shall destroy both the young man and the virgin, the suckling also with the man of gray hairs.\nDe:32:26: I said, I would scatter them into corners, I would make the remembrance of them to cease from among men:\nDe:32:27: Were it not that I feared the wrath of the enemy, lest their adversaries should behave themselves strangely, and lest they should say, Our hand is high, and the LORD hath not done all this.\nDe:32:28: For they are a nation void of counsel, neither is there any understanding in them.\nDe:32:29: O that they were wise, that they understood this, that they would consider their latter end!\nDe:32:30: How should one chase a thousand, and two put ten thousand to flight, except their Rock had sold them, and the LORD had shut them up?\nDe:32:31: For their rock is not as our Rock, even our enemies themselves being judges.\nDe:32:32: For their vine is of the vine of Sodom, and of the fields of Gomorrah: their grapes are grapes of gall, their clusters are bitter:\nDe:32:33: Their wine is the poison of dragons, and the cruel venom of asps.\nDe:32:34: Is not this laid up in store with me, and sealed up among my treasures?\nDe:32:35: To me belongeth vengeance, and recompence; their foot shall slide in due time: for the day of their calamity is at hand, and the things that shall come upon them make haste.\nDe:32:36: For the LORD shall judge his people, and repent himself for his servants, when he seeth that their power is gone, and there is none shut up, or left.\nDe:32:37: And he shall say, Where are their gods, their rock in whom they trusted,\nDe:32:38: Which did eat the fat of their sacrifices, and drank the wine of their drink offerings?  let them rise up and help you, and be your protection.\nDe:32:39: See now that I, even I, am he, and there is no god with me: I kill, and I make alive; I wound, and I heal: neither is there any that can deliver out of my hand.\nDe:32:40: For I lift up my hand to heaven, and say, I live for ever.\nDe:32:41: If I whet my glittering sword, and mine hand take hold on judgment; I will render vengeance to mine enemies, and will reward them that hate me.\nDe:32:42: I will make mine arrows drunk with blood, and my sword shall devour flesh; and that with the blood of the slain and of the captives, from the beginning of revenges upon the enemy.\nDe:32:43: Rejoice, O ye nations, with his people: for he will avenge the blood of his servants, and will render vengeance to his adversaries, and will be merciful unto his land, and to his people.',
  category: 'deuteronomy'
},
    {
  id: 'joshua24:15',
  reference: 'Joshua 24:15',
  title: 'Choose This Day Whom Ye Will Serve',
  theme: 'Faith and Obedience',
  key: 'C Major',
  tempo: 'Moderato',
  duration: '1:30',
  difficulty: 'Beginner',
  text: 'Joshua 24:15: And if it seem evil unto you to serve the LORD, choose you this day whom ye will serve; whether the gods which your fathers served that were on the other side of the flood, or the gods of the Amorites, in whose land ye dwell: but as for me and my house, we will serve the LORD.',
  category: 'history'
},
{
  id: '1samuel2:1-10',
  reference: '1 Samuel 2:1-10',
  title: 'Hannahs Prayer',
  theme: 'Praise and Thanksgiving',
  key: 'G Major',
  tempo: 'Allegro',
  duration: '3:00',
  difficulty: 'Intermediate',
  text: '1Sa:2:1: And Hannah prayed, and said, My heart rejoiceth in the LORD, mine horn is exalted in the LORD: my mouth is enlarged over mine enemies; because I rejoice in thy salvation. 1Sa:2:2: There is none holy as the LORD: for there is none beside thee: neither is there any rock like our God. 1Sa:2:3: Talk no more so exceeding proudly; let not arrogancy come out of your mouth: for the LORD is a God of knowledge, and by him actions are weighed. 1Sa:2:4: The bows of the mighty men are broken, and they that stumbled are girded with strength. 1Sa:2:5: They that were full have hired out themselves for bread; and they that were hungry ceased: so that the barren hath born seven; and she that hath many children is waxed feeble. 1Sa:2:6: The LORD killeth, and maketh alive: he bringeth down to the grave, and bringeth up. 1Sa:2:7: The LORD maketh poor, and maketh rich: he bringeth low, and lifteth up. 1Sa:2:8: He raiseth up the poor out of the dust, and lifteth up the beggar from the dunghill, to set them among princes, and to make them inherit the throne of glory: for the pillars of the earth are the LORD\'s, and he hath set the world upon them. 1Sa:2:9: He will keep the feet of his saints, and the wicked shall be silent in darkness; for by strength shall no man prevail. 1Sa:2:10: The adversaries of the LORD shall be broken to pieces; out of heaven shall he thunder upon them: the LORD shall judge the ends of the earth; and he shall give strength unto his king, and exalt the horn of his anointed.',
  category: 'history'
},

    {
      id: 'psalm150',
      reference: 'Psalm 150:1-6',
      title: 'Praise Ye the Lord',
      theme: 'Praise and Worship',
      key: 'D Minor',
      tempo: 'Allegro',
      duration: '4:00',
      difficulty: 'Advanced',
      text: 'Praise ye the Lord. Praise God in his sanctuary : praise him in the firmament of his power. Praise him for his mighty acts: praise him according to his excellent greatness. Praise him with the sound of the trumpet: praise him with the psaltery and harp. Praise him with the timbrel and dance: praise him with stringed instruments and organs. Praise him upon the loud cymbals: praise him upon the high sounding cymbals. Let every thing that hath breath praise the LORD.  Praise ye the LORD. ',
      category: 'psalms'
    }
  ] as any[];

  const categories = [
    { id: 'all', label: 'All Scripture' },
    { id: 'psalms', label: 'Psalms' },
    { id: 'gospels', label: 'Gospels' },
    { id: 'prophets', label: 'Prophets' }
  ];

  const filteredScriptures = scriptures.filter(scripture => {
    const matchesSearch = scripture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scripture.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scripture.theme.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || scripture.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500 text-green-100';
      case 'Intermediate': return 'bg-yellow-600 text-white';
      case 'Advanced': return 'bg-red-500 text-red-100';
      default: return 'bg-gray-500 text-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Scripture Library</h1>
        <p className="text-xl text-blue-100">Choose a passage to learn through music</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search scriptures, themes, or references..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-accent-600 text-white shadow-lg'
                    : 'bg-neutral-700 text-white hover:bg-neutral-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scripture Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScriptures.map((scripture) => (
          <div
            key={scripture.id}
            onClick={() => onSelectScripture(scripture)}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                    {scripture.title}
                  </h3>
                  <p className="text-blue-200 font-medium">{scripture.reference}</p>
                </div>
                <Music className="w-6 h-6 text-yellow-500 group-hover:text-yellow-300 transition-colors" />
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-500/30 text-blue-100 px-3 py-1 text-sm">
                  {scripture.key}
                </span>
                <span className="bg-purple-500/30 text-purple-100 px-3 py-1 text-sm">
                  {scripture.tempo}
                </span>
                <span className={`px-3 py-1 text-sm ${getDifficultyColor(scripture.difficulty)}`}>
                  {scripture.difficulty}
                </span>
              </div>

              <p className="text-blue-100 text-sm leading-relaxed">
                {scripture.text.substring(0, 100)}...
              </p>

              <div className="flex items-center justify-between text-sm text-blue-200">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{scripture.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{scripture.theme}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredScriptures.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-10 h-10 text-blue-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No scriptures found</h3>
          <p className="text-blue-200">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
}