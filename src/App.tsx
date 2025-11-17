import logo from "./assets/logo.png";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import {
    BookOpen,
    Award,
    CheckCircle,
    Edit2,
    Save,
    X,
    Clock,
    Plus,
    Lock,
    Unlock,
} from "lucide-react";

interface PaystackResponse {
    reference: string;
    status: string;
    message: string;
    trans: string;
    transaction: string;
    trxref: string;
}

declare global {
    interface Window {
        PaystackPop: {
            setup: (config: {
                key: string;
                email: string;
                amount: number;
                currency: string;
                reference: string;
                onClose: () => void;
                callback: (response: PaystackResponse) => void;
            }) => { openIframe: () => void };
        };
    }
}

type BibleVersions = {
    KJV: string;
    NKJV: string;
    NIV: string;
    ESV: string;
    AMP: string;
    NLT: string;
};

type ScriptureDB = Record<string, BibleVersions>;

const initialScriptureDB: ScriptureDB = {
    "Matthew 16:15": {
        KJV: "15 He saith unto them, But whom say ye that I am?",
        NKJV: "15 He said to them, 'But who do you say that I am?'",
        NIV: "15 'But what about you?' he asked. 'Who do you say I am?'",
        ESV: "15 He said to them, 'But who do you say that I am?'",
        AMP: "15 He said to them, 'But who do you [yourselves] say that I am?'",
        NLT: "15 Then he asked them, 'But who do you say I am?'",
    },
    "Proverbs 6:9-11": {
        KJV: "9 How long wilt thou sleep, O sluggard? when wilt thou arise out of thy sleep? 10 Yet a little sleep, a little slumber, a little folding of the hands to sleep: 11 So shall thy poverty come as one that travelleth, and thy want as an armed man.",
        NKJV: "9 How long will you slumber, O sluggard? When will you rise from your sleep? 10 A little sleep, a little slumber, A little folding of the hands to sleep— 11 So shall your poverty come on you like a prowler, And your need like an armed man.",
        NIV: "9 How long will you lie there, you sluggard? When will you get up from your sleep? 10 A little sleep, a little slumber, a little folding of the hands to rest— 11 and poverty will come on you like a thief and scarcity like an armed man.",
        ESV: "9 How long will you lie there, O sluggard? When will you arise from your sleep? 10 A little sleep, a little slumber, a little folding of the hands to rest, 11 and poverty will come upon you like a robber, and want like an armed man.",
        AMP: '9 How long will you lie down, O lazy one? When will you arise from your sleep [and learn self-discipline]? 10 "Yet a little sleep, a little slumber, A little folding of the hands to lie down and rest"— 11 So your poverty will come like an approaching prowler who walks [slowly, but surely] And your need [will come] like an armed man [making you helpless].',
        NLT: "9 But you, lazybones, how long will you sleep? When will you wake up? 10 A little extra sleep, a little more slumber, a little folding of the hands to rest— 11 then poverty will pounce on you like a bandit; scarcity will attack you like an armed robber.",
    },
    "Luke 15:1-2": {
        KJV: "1 Then drew near unto him all the publicans and sinners for to hear him. 2 And the Pharisees and scribes murmured, saying, This man receiveth sinners, and eateth with them.",
        NKJV: "1 Then all the tax collectors and the sinners drew near to Him to hear Him. 2 And the Pharisees and scribes complained, saying, 'This Man receives sinners and eats with them.'",
        NIV: "1 Now the tax collectors and sinners were all gathering around to hear Jesus. 2 But the Pharisees and the teachers of the law muttered, 'This man welcomes sinners and eats with them.'",
        ESV: "1 Now the tax collectors and sinners were all drawing near to hear him. 2 And the Pharisees and the scribes grumbled, saying, 'This man receives sinners and eats with them.'",
        AMP: "1 Now all the tax collectors and sinners [including non-observant Jews] were coming near Jesus to listen to Him. 2 Both the Pharisees and the scribes began muttering and complaining, saying, 'This man accepts and welcomes sinners and eats with them.'",
        NLT: "1 Tax collectors and other notorious sinners often came to listen to Jesus teach. 2 This made the Pharisees and teachers of religious law complain that he was associating with such sinful people—even eating with them!",
    },

    "John 6:37": {
        KJV: "37 All that the Father giveth me shall come to me; and him that cometh to me I will in no wise cast out.",
        NKJV: "37 All that the Father gives Me will come to Me, and the one who comes to Me I will by no means cast out.",
        NIV: "37 All those the Father gives me will come to me, and whoever comes to me I will never drive away.",
        ESV: "37 All that the Father gives me will come to me, and whoever comes to me I will never cast out.",
        AMP: "37 All that My Father gives Me will come to Me; and the one who comes to Me I will most certainly not cast out [I will never, never reject anyone who follows Me].",
        NLT: "37 However, those the Father has given me will come to me, and I will never reject them.",
    },
    "Luke 15:2": {
        KJV: "2 And the Pharisees and scribes murmured, saying, This man receiveth sinners, and eateth with them.",
        NKJV: "2 And the Pharisees and scribes complained, saying, 'This Man receives sinners and eats with them.'",
        NIV: "2 But the Pharisees and the teachers of the law muttered, 'This man welcomes sinners and eats with them.'",
        ESV: "2 And the Pharisees and the scribes grumbled, saying, 'This man receives sinners and eats with them.'",
        AMP: "2 Both the Pharisees and the scribes began muttering and complaining, saying, 'This man accepts and welcomes sinners and eats with them.'",
        NLT: "2 This made the Pharisees and teachers of religious law complain that he was associating with such sinful people—even eating with them!",
    },
    "John 6:66-69": {
        KJV: "66 From that time many of his disciples went back, and walked no more with him. 67 Then said Jesus unto the twelve, Will ye also go away? 68 Then Simon Peter answered him, Lord, to whom shall we go? thou hast the words of eternal life. 69 And we believe and are sure that thou art that Christ, the Son of the living God.",
        NKJV: "66 From that time many of His disciples went back and walked with Him no more. 67 Then Jesus said to the twelve, 'Do you also want to go away?' 68 But Simon Peter answered Him, 'Lord, to whom shall we go? You have the words of eternal life.' 69 And we have believed and have come to know that You are the Christ, the Son of the living God.",
        NIV: "66 From this time many of his disciples turned back and no longer followed him. 67 'You do not want to leave too, do you?' Jesus asked the Twelve. 68 Simon Peter answered him, 'Lord, to whom shall we go? You have the words of eternal life.' 69 We have come to believe and to know that you are the Holy One of God.",
        ESV: "66 After this many of his disciples turned back and no longer walked with him. 67 So Jesus said to the Twelve, 'Do you want to go away as well?' 68 Simon Peter answered him, 'Lord, to whom shall we go? You have the words of eternal life.' 69 And we have believed, and have come to know, that you are the Holy One of God.",
        AMP: "66 From that time many of His disciples turned away and no longer walked with Him. 67 Then Jesus said to the Twelve, 'You do not want to go away also, do you?' 68 Simon Peter answered Him, 'Lord, to whom shall we go? You have the words of eternal life.' 69 And we have believed and we know and are convinced that You are the Christ, the Son of the living God.",
        NLT: "66 After this, many of his disciples turned back and no longer followed him. 67 'You do not want to leave too, do you?' Jesus asked the Twelve. 68 Simon Peter answered him, 'Lord, to whom shall we go? You have the words of eternal life.' 69 We have come to believe and know that you are the Holy One of God.",
    },

    "Matthew 11:28": {
        KJV: "28 Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
        NKJV: "28 Come to Me, all you who labor and are heavy laden, and I will give you rest.",
        NIV: "28 Come to me, all you who are weary and burdened, and I will give you rest.",
        ESV: "28 Come to me, all who labor and are heavy laden, and I will give you rest.",
        AMP: "28 Come to Me, all who are weary and heavily burdened [by religious rituals that provide no peace], and I will give you rest [refreshing your souls with salvation].",
        NLT: "28 Then Jesus said, 'Come to me, all of you who are weary and carry heavy burdens, and I will give you rest.'",
    },

    "John 10:27": {
        KJV: "27 My sheep hear my voice, and I know them, and they follow me:",
        NKJV: "27 My sheep hear My voice, and I know them, and they follow Me.",
        NIV: "27 My sheep listen to my voice; I know them, and they follow me.",
        ESV: "27 My sheep hear my voice, and I know them, and they follow me.",
        AMP: "27 The sheep that are My own hear My voice and listen to Me; I know them, and they follow Me.",
        NLT: "27 My sheep listen to my voice; I know them, and they follow me.",
    },
    "John 6:69": {
        KJV: "69 And we believe and are sure that thou art that Christ, the Son of the living God.",
        NKJV: "69 And we have believed and have come to know that You are the Christ, the Son of the living God.",
        NIV: "69 We have come to believe and to know that you are the Holy One of God.",
        ESV: "69 And we have believed, and have come to know, that you are the Holy One of God.",
        AMP: "69 And we have believed and we know and are convinced that You are the Christ, the Son of the living God.",
        NLT: "69 We have come to believe and know that you are the Holy One of God.",
    },

    "John 8:12": {
        KJV: "12 Then spake Jesus again unto them, saying, I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life.",
        NKJV: "12 Then Jesus spoke to them again, saying, 'I am the light of the world. He who follows Me shall not walk in darkness, but have the light of life.'",
        NIV: "12 When Jesus spoke again to the people, he said, 'I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life.'",
        ESV: "12 Again Jesus spoke to them, saying, 'I am the light of the world. Whoever follows me will not walk in darkness, but will have the light of life.'",
        AMP: "12 Once more Jesus addressed the crowd. He said, 'I am the Light of the world. He who follows Me will not walk in the darkness, but will have the Light of life.'",
        NLT: "12 Jesus spoke to the people once more and said, 'I am the light of the world. If you follow me, you won’t have to walk in darkness, because you will have the light that leads to life.'",
    },

    "John 14:6": {
        KJV: "6 Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
        NKJV: "6 Jesus said to him, 'I am the way, the truth, and the life. No one comes to the Father except through Me.'",
        NIV: "6 Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'",
        ESV: "6 Jesus said to him, 'I am the way, and the truth, and the life. No one comes to the Father except through me.'",
        AMP: "6 Jesus said to him, 'I am the [only] Way [to God] and the [real] Truth and the [real] Life; no one comes to the Father but through Me.'",
        NLT: "6 Jesus told him, 'I am the way, the truth, and the life. No one can come to the Father except through me.'",
    },
    "Daniel 11:32": {
        KJV: "32 And such as do wickedly against the covenant shall he corrupt by flatteries: but the people that do know their God shall be strong, and do exploits.",
        NKJV: "32 Those who do wickedly against the covenant he shall corrupt with flattery; but the people who know their God shall be strong, and carry out great exploits.",
        NIV: "32 With flattery he will corrupt those who have violated the covenant, but the people who know their God will firmly resist him.",
        ESV: "32 He shall seduce with flattery those who violate the covenant, but the people who know their God shall stand firm and take action.",
        AMP: "32 With smooth words [of flattery and praise] he will turn to godlessness those who [are willing to] disregard the [Mosaic] covenant, but the people who [are spiritually mature and] know their God will display strength and take action [to resist].",
        NLT: "32 He will flatter and win over those who have violated the covenant. But the people who know their God will be strong and will resist him.",
    },
    "Proverbs 24:4-5": {
        KJV: "4 And by knowledge shall the chambers be filled With all precious and pleasant riches. 5 A wise man is strong; Yea, a man of knowledge increaseth strength.",
        NKJV: "4 By knowledge the rooms are filled With all precious and pleasant riches. 5 A wise man is strong, Yes, a man of knowledge increases strength.",
        NIV: "4 through knowledge its rooms are filled with rare and beautiful treasures. 5 The wise prevail through great power, and those who have knowledge muster their strength.",
        ESV: "4 and by knowledge the rooms are filled with all precious and pleasant riches. 5 A wise man is strong, and a man of knowledge increases strength,",
        AMP: "4 And by knowledge its rooms are filled With all precious and pleasant riches. 5 A wise man is strong, And a man of knowledge strengthens his power; [Prov 21:22; Eccl 9:16]",
        NLT: "4 Through knowledge its rooms are filled with all sorts of precious riches and valuables. 5 The wise are mightier than the strong, and those with knowledge grow stronger and stronger.",
    },
    "John 1:9": {
        KJV: "9 That was the true Light, which lighteth every man that cometh into the world.",
        NKJV: "9 That was the true Light which gives light to every man coming into the world.",
        NIV: "9 The true light that gives light to everyone was coming into the world.",
        ESV: "9 The true light, which enlightens everyone, was coming into the world.",
        AMP: "9 There was the true Light then coming into the world [the genuine, perfect, steadfast Light] that illumines every person.",
        NLT: "9 The one who is the true light, who gives light to everyone, was coming into the world.",
    },

    "Hosea 4:6": {
        KJV: "6 My people are destroyed for lack of knowledge: because thou hast rejected knowledge, I will also reject thee, that thou shalt be no priest to me: seeing thou hast forgotten the law of thy God, I will also forget thy children.",
        NKJV: "6 My people are destroyed for lack of knowledge. Because you have rejected knowledge, I also will reject you from being My priest; Because you have forgotten the law of your God, I also will forget your children.",
        NIV: "6 my people are destroyed from lack of knowledge. 'Because you have rejected knowledge, I also reject you as my priests; because you have ignored the law of your God, I also will ignore your children.",
        ESV: "6 My people are destroyed for lack of knowledge; because you have rejected knowledge, I reject you from being a priest to me. And since you have forgotten the law of your God, I also will forget your children.",
        AMP: "6 My people are destroyed for lack of knowledge [of My law, where I reveal My will]. Because you [the priestly nation] have rejected knowledge, I will also reject you from being My priest. Since you have forgotten the law of your God, I will also forget your children.",
        NLT: "6 My people are being destroyed because they don’t know me. Since you priests refuse to know me, I refuse to recognize you as my priests. Since you have forgotten the laws of your God, I will forget to bless your children.",
    },
    "John 6:68-69": {
        KJV: "68 Then Simon Peter answered him, Lord, to whom shall we go? thou hast the words of eternal life. 69 And we believe and are sure that thou art that Christ, the Son of the living God.",
        NKJV: "68 But Simon Peter answered Him, “Lord, to whom shall we go? You have the words of eternal life. 69 Also we have come to believe and know that You are the Christ, the Son of the living God.”",
        NIV: "68 Simon Peter answered him, 'Lord, to whom shall we go? You have the words of eternal life. 69 We have come to believe and to know that you are the Holy One of God.'",
        ESV: "68 Simon Peter answered him, “Lord, to whom shall we go? You have the words of eternal life, 69 and we have believed, and have come to know, that you are the Holy One of God.”",
        AMP: "68 Simon Peter answered, “Lord, to whom shall we go? You [alone] have the words of eternal life [you are our only hope]. 69 We have believed and confidently trusted, and [even more] we have come to know [by personal observation and experience] that You are the Holy One of God [the Christ, the Son of the living God].”.",
        NLT: "68 Simon Peter replied, “Lord, to whom would we go? You have the words that give eternal life. 69 We believe, and we know you are the Holy One of God.”",
    },
    "Isaiah 61:1-3": {
        KJV: "1 The Spirit of the Lord GOD is upon me; because the LORD hath anointed me to preach good tidings unto the meek; he hath sent me to bind up the brokenhearted, to proclaim liberty to the captives, and the opening of the prison to them that are bound; 2 To proclaim the acceptable year of the LORD, and the day of vengeance of our God; to comfort all that mourn; 3 To appoint unto them that mourn in Zion, to give unto them beauty for ashes, the oil of joy for mourning, the garment of praise for the spirit of heaviness; that they might be called trees of righteousness, the planting of the LORD, that he might be glorified.",
        NKJV: "1 The Spirit of the Lord GOD is upon Me, Because the LORD has anointed Me To preach good tidings to the poor; He has sent Me to heal the brokenhearted, To proclaim liberty to the captives, And the opening of the prison to those who are bound; 2 To proclaim the acceptable year of the LORD, And the day of vengeance of our God; To comfort all who mourn, 3 To console those who mourn in Zion, To give them beauty for ashes, The oil of joy for mourning, The garment of praise for the spirit of heaviness; That they may be called trees of righteousness, The planting of the LORD, that He may be glorified.",
        NIV: "1 The Spirit of the Sovereign LORD is on me, because the LORD has anointed me to proclaim good news to the poor. He has sent me to bind up the brokenhearted, to proclaim freedom for the captives and release from darkness for the prisoners, 2 to proclaim the year of the LORD’s favor and the day of vengeance of our God, to comfort all who mourn, 3 and provide for those who grieve in Zion—to bestow on them a crown of beauty instead of ashes, the oil of joy instead of mourning, and a garment of praise instead of a spirit of despair. They will be called oaks of righteousness, a planting of the LORD for the display of his splendor.",
        ESV: "1 The Spirit of the Lord GOD is upon me, because the LORD has anointed me to bring good news to the poor; he has sent me to bind up the brokenhearted, to proclaim liberty to the captives, and the opening of the prison to those who are bound; 2 to proclaim the year of the LORD's favor, and the day of vengeance of our God; to comfort all who mourn; 3 to grant to those who mourn in Zion—to give them a beautiful headdress instead of ashes, the oil of gladness instead of mourning, the garment of praise instead of a faint spirit; that they may be called oaks of righteousness, the planting of the LORD, that he might be glorified.",
        AMP: "1 The Spirit of the Lord GOD is upon me, Because the LORD has anointed and commissioned me To bring good news to the humble and afflicted; He has sent me to bind up [the wounds of] the brokenhearted, To proclaim release [from confinement and condemnation] to the [physical and spiritual] captives And freedom to prisoners, 2 To proclaim [a]the favorable year of the Lord, [b]And the day of vengeance and retribution of our God, To comfort all who mourn, 3 To [c]console those who mourn in Zion, To give them beauty for ashes, The oil of joy for mourning, The garment of praise for a spirit of heaviness, That they may be called trees of righteousness [locally], The planting of the Lord, that He may be glorified.",
        NLT: "1 The Spirit of the Sovereign LORD is upon me, for the LORD has anointed me to bring good news to the poor. He has sent me to comfort the brokenhearted, to proclaim that captives will be released and prisoners will be freed. 2 He has sent me to tell those who mourn that the time of the LORD’s favor has come, and with it, the day of God’s anger against their enemies. 3 To all who mourn in Israel, he will give a crown of beauty for ashes, a joyous blessing instead of mourning, festive praise instead of despair. In their righteousness, they will be like great oaks that the LORD has planted for his own glory.",
    },
    "Isaiah 53:4-5": {
        KJV: "4 Surely he hath borne our griefs, and carried our sorrows: yet we did esteem him stricken, smitten of God, and afflicted. 5 But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.",
        NKJV: "4 Surely He has borne our griefs And carried our sorrows; Yet we esteemed Him stricken, Smitten by God, and afflicted. 5 But He was wounded for our transgressions, He was bruised for our iniquities; The chastisement for our peace was upon Him, And by His stripes we are healed.",
        NIV: "4 Surely he took up our pain and bore our suffering, yet we considered him punished by God, stricken by him, and afflicted. 5 But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.",
        ESV: "4 Surely he has borne our griefs and carried our sorrows; yet we esteemed him stricken, smitten by God, and afflicted. 5 But he was wounded for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace, and with his stripes we are healed.",
        AMP: "4 Surely He has [a]borne our griefs (sicknesses, weaknesses, and distresses) and carried our sorrows and pain; yet we [ignorantly] assumed that He was stricken, struck down by God, and degraded and humiliated [by Him]. 5 But He was wounded for our transgressions, He was crushed for our wickedness [our sin, our injustice, our wrongdoing]; The punishment [required] for our well-being fell on Him, And by His stripes (wounds) we are healed.",
        NLT: "4 Yet it was our weaknesses he carried; it was our sorrows that weighed him down. And we thought his troubles were a punishment from God, a punishment for his own sins! 5 But he was pierced for our rebellion, crushed for our sins. He was beaten so we could be whole. He was whipped so we could be healed.",
    },
    "Matthew 11:25-26": {
        KJV: "25 At that time Jesus answered and said, I thank thee, O Father, Lord of heaven and earth, because thou hast hid these things from the wise and prudent, and hast revealed them unto babes. 26 Even so, Father: for so it seemed good in thy sight.",
        NKJV: "25 At that time Jesus answered and said, 'I thank You, Father, Lord of heaven and earth, that You have hidden these things from the wise and prudent and have revealed them to babes. 26 Even so, Father, for so it seemed good in Your sight.'",
        NIV: "25 At that time Jesus said, 'I praise you, Father, Lord of heaven and earth, because you have hidden these things from the wise and learned, and revealed them to little children. 26 Yes, Father, for this is what you were pleased to do.'",
        ESV: "25 At that time Jesus declared, 'I thank you, Father, Lord of heaven and earth, that you have hidden these things from the wise and understanding and revealed them to little children; 26 yes, Father, for such was your gracious will.'",
        AMP: "25 At that time Jesus began to speak and said, “I praise and thank You, Father, Lord of heaven and earth, that You have hidden these things from the wise and intelligent and clever, and have revealed them to infants [the childlike and untaught]. 26 Yes, Father, for this way was [agreeable and] well-pleasing in Your sight.",
        NLT: "25 At that time Jesus prayed this prayer: 'O Father, Lord of heaven and earth, thank you for hiding these things from those who think themselves wise and clever, and for revealing them to the childlike. 26 Yes, Father, it pleased you to do it this way!'",
    },
    "Isaiah 9:6-7": {
        KJV: "6 For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace. 7 Of the increase of his government and peace there shall be no end, upon the throne of David, and upon his kingdom, to order it, and to establish it with judgment and with justice from henceforth even for ever. The zeal of the LORD of hosts will perform this.",
        NKJV: "6 For unto us a Child is born, Unto us a Son is given; And the government will be upon His shoulder. And His name will be called Wonderful, Counselor, Mighty God, Everlasting Father, Prince of Peace. 7 Of the increase of His government and peace There will be no end, Upon the throne of David and over His kingdom, To order it and establish it with judgment and justice From that time forward, even forever. The zeal of the LORD of hosts will perform this.",
        NIV: "6 For to us a child is born, to us a son is given, and the government will be on his shoulders. And he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace. 7 Of the greatness of his government and peace there will be no end. He will reign on David’s throne and over his kingdom, establishing and upholding it with justice and righteousness from that time on and forever. The zeal of the LORD Almighty will accomplish this.",
        ESV: "6 For to us a child is born, to us a son is given; and the government shall be upon his shoulder, and his name shall be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace. 7 Of the increase of his government and of peace there will be no end, on the throne of David and over his kingdom, to establish it and to uphold it with justice and with righteousness from this time forth and forevermore. The zeal of the LORD of hosts will do this.",
        AMP: "6 For to us a Child shall be born, unto us a Son shall be given; And the government shall be upon His shoulder; And His name shall be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace. 7 There shall be no end to the increase of His government and of peace, [He shall rule] on the throne of David and over his kingdom, To establish it and to uphold it with justice and righteousness From that time forward and forevermore. The zeal of the LORD of hosts will accomplish this.",
        NLT: "6 For a child is born to us, a son is given to us. The government will rest on his shoulders. And he will be called: Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace. 7 His government and its peace will never end. He will rule with fairness and justice from the throne of his ancestor David for all eternity. The passionate commitment of the LORD of Heaven’s Armies will make this happen!",
    },
    "Titus 1:14": {
        KJV: "14 Not giving heed to Jewish fables, and commandments of men, that turn from the truth.",
        NKJV: "14 not giving heed to Jewish fables and commandments of men who turn from the truth.",
        NIV: "14 and will pay no attention to Jewish myths or to the merely human commands of those who reject the truth.",
        ESV: "14 not devoting themselves to Jewish myths and the commands of people who turn away from the truth.",
        AMP: "14 and will not pay attention to Jewish myths and the instructions of men who turn away from the truth.",
        NLT: "14 They must stop listening to Jewish myths and the commands of people who have turned away from the truth.",
    },
    "Acts 2:42": {
        KJV: "42 And they continued stedfastly in the apostles' doctrine and fellowship, and in breaking of bread, and in prayers.",
        NKJV: "42 And they continued steadfastly in the apostles’ doctrine and fellowship, in the breaking of bread, and in prayers.",
        NIV: "42 They devoted themselves to the apostles’ teaching and to fellowship, to the breaking of bread and to prayer.",
        ESV: "42 And they devoted themselves to the apostles' teaching and the fellowship, to the breaking of bread and the prayers.",
        AMP: "42 And they continued steadfastly in the apostles’ teaching and the fellowship, in the breaking of bread, and in prayers.",
        NLT: "42 All the believers devoted themselves to the apostles’ teaching, and to fellowship, and to sharing in meals (including the Lord’s Supper), and to prayer.",
    },
    "Hebrews 10:25": {
        KJV: "25 Not forsaking the assembling of ourselves together, as the manner of some is; but exhorting one another: and so much the more, as ye see the day approaching.",
        NKJV: "25 not forsaking the assembling of ourselves together, as is the manner of some, but exhorting one another, and so much the more as you see the Day approaching.",
        NIV: "25 not giving up meeting together, as some are in the habit of doing, but encouraging one another—and all the more as you see the Day approaching.",
        ESV: "25 not neglecting to meet together, as is the habit of some, but encouraging one another, and all the more as you see the Day drawing near.",
        AMP: "25 not forsaking our meeting together [as believers for worship and instruction], as is the habit of some, but encouraging one another; and all the more [faithfully] as you see the day [both of Christ’s coming and of God’s judgment] approaching.",
        NLT: "25 And let us not neglect our meeting together, as some people do, but encourage one another, especially now that the day of his return is drawing near.",
    },
    "Acts 4:19": {
        KJV: "19 But Peter and John answered and said unto them, Whether it be right in the sight of God to hearken unto you more than unto God, judge ye.",
        NKJV: "19 But Peter and John answered and said to them, “Whether it is right in the sight of God to listen to you more than to God, you judge.",
        NIV: "19 But Peter and John replied, “Which is right in God’s eyes: to listen to you, or to him? You be the judges!",
        ESV: "19 But Peter and John answered them, “Whether it is right in the sight of God to listen to you rather than to God, you must judge,",
        AMP: "19 But Peter and John replied to them, “Whether it is right in the sight of God to listen to you more than to God, you judge;",
        NLT: "19 But Peter and John replied, “Do you think God wants us to obey you rather than him? You decide.",
    },

    "Mark 3:13-15": {
        KJV: "13 And he goeth up into a mountain, and calleth unto him whom he would: and they came unto him. 14 And he ordained twelve, that they should be with him, and that he might send them forth to preach, 15 And to have power to heal sicknesses, and to cast out devils:",
        NKJV: "13 And He went up on the mountain and called to Himself those He Himself wanted. And they came to Him. 14 Then He appointed twelve, that they might be with Him and that He might send them out to preach, 15 and to have power to heal sicknesses and to cast out demons:",
        NIV: "13 Jesus went up on a mountainside and called to him those he wanted, and they came to him. 14 He appointed twelve that they might be with him and that he might send them out to preach 15 and to have authority to drive out demons.",
        ESV: "13 And he went up on the mountain and called to him those whom he desired, and they came to him. 14 And he appointed twelve (whom he also named apostles) so that they might be with him and he might send them out to preach 15 and have authority to cast out demons.",
        AMP: "13 He went up on the hillside and called those whom He Himself wanted and chose; and they came to Him. 14 And He appointed twelve [disciples], so that they would be with Him [for instruction] and so that He could send them out to preach [the gospel as apostles—that is, as His special messengers, personally chosen representatives], 15 and to have authority and power to cast out demons.",
        NLT: "13 Afterward Jesus went up on a mountain and called out the ones he wanted to go with him. And they came to him. 14 Then he appointed twelve of them and called them his apostles. They were to accompany him, and he would send them out to preach, 15 giving them authority to cast out demons.",
    },
    "Acts 4:13": {
        KJV: "13 Now when they saw the boldness of Peter and John, and perceived that they were unlearned and ignorant men, they marvelled; and they took knowledge of them, that they had been with Jesus.",
        NKJV: "13 Now when they saw the boldness of Peter and John, and perceived that they were uneducated and untrained men, they marveled. And they realized that they had been with Jesus.",
        NIV: "13 When they saw the courage of Peter and John and realized that they were unschooled, ordinary men, they were astonished and took note that these men had been with Jesus.",
        ESV: "13 Now when they saw the boldness of Peter and John, and perceived that they were uneducated, common men, they were astonished. And they recognized that they had been with Jesus.",
        AMP: "13 When they saw the **courage and boldness** of Peter and John, and realized that they were uneducated and untrained [in the Mosaic Law], they were surprised, and they recognized that they had been with Jesus.",
        NLT: "13 The members of the council were amazed when they saw the boldness of Peter and John, for they could see that they were ordinary men with no special training in the Scriptures. They also recognized them as men who had been with Jesus.",
    },
    "2 Timothy 1:12": {
        KJV: "12 For the which cause I also suffer these things: nevertheless I am not ashamed: for I know whom I have believed, and am persuaded that he is able to keep that which I have committed unto him against that day.",
        NKJV: "12 For this reason I also suffer these things; nevertheless I am not ashamed, for I know whom I have believed and am persuaded that He is able to keep what I have committed to Him until that Day.",
        NIV: "12 That is why I am suffering as I am. Yet this is no cause for shame, because I know whom I have believed, and am convinced that he is able to guard what I have entrusted to him until that day.",
        ESV: "12 which is why I suffer as I do. But I am not ashamed, for I know whom I have believed, and I am convinced that he is able to guard until that day what has been entrusted to me.",
        AMP: "12 This is why I suffer these things; but I am not ashamed, for I know Him [that is, I have a personal knowledge of Jesus Christ] whom I have believed and trusted [with unquestioning confidence], and I am [absolutely] convinced and sure that He is able to guard and keep safe until that day that which I have entrusted to Him.",
        NLT: "12 That is why I am suffering here in prison. But I am not ashamed of it, for I know the one in whom I trust, and I am sure that he is able to guard what I have entrusted to him until the day of his return.",
    },
    "Proverbs 3:4-5": {
        KJV: "4 So shalt thou find favour and good understanding In the sight of God and man. 5 Trust in the LORD with all thine heart; And lean not unto thine own understanding.",
        NKJV: "4 And so find favor and high esteem In the sight of God and man. 5 Trust in the LORD with all your heart, And lean not on your own understanding;",
        NIV: "4 Then you will win favor and a good name in the sight of God and man. 5 Trust in the LORD with all your heart and lean not on your own understanding;",
        ESV: "4 So you will find favor and good success In the sight of God and man. 5 Trust in the LORD with all your heart, and do not lean on your own understanding.",
        AMP: "4 So find favor and high esteem In the sight of God and man. [Luke 2:52] 5 Trust in and rely confidently on the LORD with all your heart And do not rely on your own insight or understanding.",
        NLT: "4 Then you will find favor with both God and people, and you will earn a good reputation. 5 Trust in the LORD with all your heart; do not depend on your own understanding.",
    },
    "Isaiah 1:19": {
        KJV: "19 If ye be willing and obedient, ye shall eat the good of the land:",
        NKJV: "19 If you are willing and obedient, You shall eat the good of the land;",
        NIV: "19 If you are willing and obedient, you will eat the good things of the land;",
        ESV: "19 If you are willing and obedient, you shall eat the good of the land;",
        AMP: "19 “If you are willing and obedient, You shall eat the best of the land;",
        NLT: "19 If you will only obey me, you will have plenty to eat.",
    },
    "1 Timothy 1:4": {
        KJV: "4 Neither give heed to fables and endless genealogies, which minister questions, rather than godly edifying which is in faith: so do.",
        NKJV: "4 nor give heed to fables and endless genealogies, which cause disputes rather than godly edification which is in faith.",
        NIV: "4 nor to devote themselves to myths and endless genealogies. These promote controversial speculations rather than advancing God’s work—which is by faith.",
        ESV: "4 nor devote themselves to myths and endless genealogies, which promote speculations rather than the stewardship from God that is by faith.",
        AMP: "4 nor to pay attention to legends (fables, myths) and endless genealogies, which give rise to useless speculation and meaningless arguments rather than advancing God’s [work which is to be accomplished] by faith [in Him].",
        NLT: "4 Don’t let them waste their time in endless discussion of myths and spiritual pedigrees. These things only lead to meaningless speculations, which don’t help people live a life of faith in God.",
    },
};

const quizQuestions = [
    {
        q: "According to Matthew 16:15, what did Jesus ask His disciples?",
        a: [
            "But whom say ye that I am?",
            "Do you believe in Me?",
            "Why do you follow Me?",
            "Who do men say that I am?",
        ],
        correct: 0,
    },
    {
        q: "Who was Jesus speaking to in Matthew 16:15 when He asked, 'But whom say ye that I am?'",
        a: [
            "His disciples",
            "The Pharisees",
            "The multitudes",
            "The Roman soldiers",
        ],
        correct: 0,
    },
    {
        q: "From Luke 15:1–2, who drew near to hear Jesus?",
        a: [
            "All the publicans and sinners",
            "Only the Pharisees and scribes",
            "The disciples alone",
            "The Roman soldiers",
        ],
        correct: 0,
    },
    {
        q: "According to Luke 15:2, what complaint did the Pharisees and scribes make against Jesus?",
        a: [
            "This man receives sinners and eats with them",
            "He breaks the law of Moses",
            "He works miracles by Beelzebub",
            "He calls Himself the Son of God",
        ],
        correct: 0,
    },
    {
        q: "What is the Memory Verse of this lesson?",
        a: [
            "He saith unto them, But whom say ye that I am?",
            "The Lord is my shepherd; I shall not want.",
            "Blessed are the pure in heart, for they shall see God.",
            "I am the way, the truth, and the life.",
        ],
        correct: 0,
    },
    {
        q: "Where is the Memory Verse found in the Bible?",
        a: ["Matthew 16:15", "Luke 15:1–2", "John 3:16", "Mark 10:45"],
        correct: 0,
    },
    {
        q: "What is the main aim of this lesson?",
        a: [
            "To reveal man’s contempt of Christ and efforts to sabotage His gesture",
            "To discuss the miracles of Jesus only",
            "To explain the teachings of John the Baptist",
            "To analyze the customs of the Pharisees",
        ],
        correct: 0,
    },
    {
        q: "What is the objective of this lesson?",
        a: [
            "That man may have a personal conviction about Jesus",
            "That people may understand Jewish traditions",
            "That people may learn how to perform miracles",
            "That people may study the life of Peter",
        ],
        correct: 0,
    },
    {
        q: "According to the lesson, why do men and Satan dislike your coming to Jesus?",
        a: [
            "Because your salvation will break their control over you",
            "Because they want you to remain religious",
            "Because they want to help you in another way",
            "Because they think Jesus is a false teacher",
        ],
        correct: 0,
    },
    {
        q: "What did the Pharisees and scribes aim to achieve by discouraging people from following Jesus?",
        a: [
            "To maintain their social and religious influence",
            "To protect the temple from crowds",
            "To increase attendance at synagogues",
            "To promote unity among the Jews",
        ],
        correct: 0,
    },
    {
        q: "What change did Jesus’ coming bring according to the lesson?",
        a: [
            "He opened the door of salvation to all without class restriction",
            "He limited salvation to the Jews only",
            "He gave more power to the Pharisees",
            "He abolished all forms of teaching and healing",
        ],
        correct: 0,
    },
    {
        q: "According to the lesson, what should be your focus when you come to Jesus?",
        a: [
            "To hear Him and be blessed",
            "To show off your knowledge",
            "To argue with religious leaders",
            "To perform miracles for fame",
        ],
        correct: 0,
    },
    {
        q: "According to the Introduction, what have the enemies of the Lord tried to do?",
        a: [
            "Spoil the minds of people from having a personal relationship with Jesus",
            "Help people understand the law better",
            "Encourage people to study the Scriptures",
            "Promote unity among believers",
        ],
        correct: 0,
    },
    {
        q: "In the lesson, what does your 'coming to Jesus' represent?",
        a: [
            "A change that brings salvation and breaks bondage",
            "A normal religious practice",
            "A public declaration for fame",
            "A sign of weakness",
        ],
        correct: 0,
    },
    {
        q: "According to the lesson, what kind of people were the Pharisees and scribes?",
        a: [
            "Selected elites seeking self-satisfaction, not God’s glory",
            "Faithful followers of Jesus",
            "Gentiles who feared God",
            "Fishermen and farmers",
        ],
        correct: 0,
    },
    {
        q: "Why did the Pharisees resist Jesus’ popularity?",
        a: [
            "Because His message attracted people of all classes",
            "Because He spoke only in parables",
            "Because He refused to pay temple taxes",
            "Because He never visited Jerusalem",
        ],
        correct: 0,
    },
    {
        q: "What does the lesson say happens to those who hear Jesus?",
        a: [
            "They are blessed, though troubled by the Pharisees",
            "They become proud and self-righteous",
            "They are rejected by God",
            "They stop attending the synagogue",
        ],
        correct: 0,
    },
    {
        q: "What does the Conclusion of the lesson warn believers to do?",
        a: [
            "Guard their relationship with Jesus jealously",
            "Ignore the opinions of others completely",
            "Focus on worldly achievements",
            "Avoid all forms of association with others",
        ],
        correct: 0,
    },
    {
        q: "What happens if a believer fails to guard his entrance to Jesus Christ?",
        a: [
            "He may fall away unto condemnation",
            "He will become more popular",
            "He will gain worldly blessings",
            "He will lose his possessions only",
        ],
        correct: 0,
    },
];

const SundaySchoolApp = () => {
    const [showPaymentGate, setShowPaymentGate] = useState(true);
    const [isPaid, setIsPaid] = useState(false);
    const [activeTab, setActiveTab] = useState("intro");
    const [darkMode, setDarkMode] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [loading, setLoading] = useState(false);
    const [appLoading, setAppLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [scriptureDB, setScriptureDB] =
        useState<ScriptureDB>(initialScriptureDB);
    const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
    const [bibleVersion, setBibleVersion] =
        useState<keyof BibleVersions>("KJV");
    const [showVerseModal, setShowVerseModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newVerse, setNewVerse] = useState<{
        reference: string;
        versions: BibleVersions;
    }>({
        reference: "",
        versions: { KJV: "", NKJV: "", NIV: "", ESV: "", AMP: "", NLT: "" },
    });
    const [verseLoading, setVerseLoading] = useState(false);
    const [quizActive, setQuizActive] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(50);
    const [showResults, setShowResults] = useState(false);
    const [faithRating, setFaithRating] = useState(5);
    const [commitments, setCommitments] = useState<
        Array<{ text: string; date: string }>
    >([]);
    const [commitmentInput, setCommitmentInput] = useState("");
    const [editingContent, setEditingContent] = useState<string | null>(null);

    type SubPoint = { title: string; content: string; scripture?: string };
    type LessonPoint = {
        title: string;
        content: string;
        scriptures: string[];
        subPoints: SubPoint[];
    };
    type ContentData = {
        lessonDate: string;
        lessonTitle: string;
        memoryVerse: string;
        memoryVerseRef: string;
        introduction: string;
        introScriptures: string[];
        lessonIntroScriptures: string[];
        aims: string;
        objectives: string;
        lessonIntro: string;
        lessonPoints: LessonPoint[];
        conclusion: string;
        conclusionScriptures: string[];
        prayerPoints: string[];
    };

    const [contentData, setContentData] = useState<ContentData>({
        lessonDate: "April 19, 2015",
        lessonTitle: "Your Position About Jesus Christ - Part 3",
        memoryVerse:
            "And such as do wickedly against the covenant shall he corrupt by flatteries: but the people that do know their God shall be strong, and do exploits.",
        memoryVerseRef: "Daniel 11:32",
        introduction:
            "Having previously established the facts that it is the ignorant or jealous losers and opposers of all ages that coin people out of Jesus, we need to know how to stop them. Knowledge is paramount in this fight to conquer as indicated in the memory verse and Proverbs 24:4–5.",
        introScriptures: ["Proverbs 24:4-5"],
        aims: "To reveal man's contempt of Christ and efforts to sabotage His gesture.",
        objectives: "That men may have a personal conviction about Christ.",
        lessonIntro:
            "Jesus is the light, and those in the light cannot stumble - John 1:9, 8:12. How then could you allow ignorant people to persuade you that are in the light from serving or following Jesus fully? Ignorance destroys the strong and mighty, but personal conviction preserves - Hos. 4:6, John 6:68-69. Today's lesson reveals how to be personally convinced and stop the opposers.",
        // lesonIntroScriptures["John 1:9"],
        lessonIntroScriptures: [
            "John 1:9",
            "John 8:12",
            "Hosea 4:6",
            "John 6:68-69",
        ],

        lessonPoints: [
            {
                title: "How to Have a Personal Conviction",
                content:
                    "Jesus fits perfectly into your needs Is. 61:1-3, Is. 53:4-5, This poor sinners and the tormented are quick to come to Jesus because of their conditions. Most people are rejected or barred by society and need someone to lean on. Jesus fits into their needs, and this is why they discourage you. But if you know how Jesus fits into your life, you will tarry with Him.",
                scriptures: ["Isaiah 61:1-3", "Isaiah 53:4-5"],
                subPoints: [],
            },
            {
                title: "Others Don’t See What You See",
                content:
                    "God reveals to the lowly and humble Matt. 11:25-26. That is why you must stick to Jesus.",
                scriptures: ["Matthew 11:25-26"],
                subPoints: [],
            },
            {
                title: "Consider the Prophecies About Him",
                content: "",
                scriptures: ["Isaiah 9:6-7"],
                subPoints: [],
            },
            {
                title: "Come and Be with Christ",
                content: "",
                scriptures: ["Mark 3:13-15", "Acts 4:13"],
                subPoints: [],
            },
            {
                title: "Be Purposeful and Focused",
                content:
                    "2 Tim. 1:12, If you are purposeful and focused, nobody can turn you away from Jesus. Obey His instructions.",
                scriptures: ["2 Timothy 1:12"],
                subPoints: [],
            },
            {
                title: "Trust and Obey",
                content:
                    "Prov. 3:4-5, Isa. 1:19. Believe and practice God's word and the manifestation will convince you.",
                scriptures: ["Proverbs 3:4-5", "Isaiah 1:19"],
                subPoints: [],
            },
            {
                title: "Avoid Those Who Hate Christ",
                content:
                    "1 Tim. 1:4, Titus 1:14. Words are powerful. If you avoid the words of Christ-haters, your conviction will appear.",
                scriptures: ["1 Timothy 1:4", "Titus 1:14"],
                subPoints: [],
            },
            {
                title: "Constant Fellowship",
                content:
                    "Through praise, worship, study, fasting, personal prayer life, and congregating with other believers - Acts 2:42, Hebrews 10:25",
                scriptures: ["Acts 2:42", "Hebrews 10:25"],
                subPoints: [],
            },
            {
                title: "Ask the Opposers the Unanswerable Question",
                content:
                    "Ask whether you should obey them or Jesus - Acts 4:19.",
                scriptures: ["Acts 4:19"],
                subPoints: [],
            },
        ],
        conclusion:
            "If you know whom you have come to serve and are persuaded that He is the Messiah, no enemy of Jesus will be able to turn you away from Him. Draw nearer to Him and you will know Him better.",
        conclusionScriptures: [],
        prayerPoints: [
            "Lord, help me to be personally convinced about Jesus Christ.",
            "Father, keep me strong against opposers of the faith.",
            "Holy Spirit, reveal Jesus to me more deeply.",
            "Lord, help me to trust and obey Your word always.",
            "Father, strengthen my fellowship life and help me stay connected to other believers.",
        ],
    });

    const formatScriptureText = (text: string) => {
        const parts = text.split(/(\d+)/);
        return parts.map((part, index) => {
            if (/^\d+$/.test(part)) {
                return (
                    <strong key={index} className="font-bold">
                        {part}
                    </strong>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setAppLoading(false), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const toggleTheme = () => setDarkMode(!darkMode);
    const adjustFontSize = (delta: number) =>
        setFontSize((prev) => Math.min(Math.max(prev + delta, 12), 24));
    const handleTabChange = (tab: string) => {
        setLoading(true);
        setTimeout(() => {
            setActiveTab(tab);
            setLoading(false);
        }, 500);
    };

    const showBibleVersions = (reference: string) => {
        setSelectedVerse(reference);
        setShowVerseModal(true);
        setVerseLoading(true);
        setTimeout(() => setVerseLoading(false), 800);
    };

    const changeBibleVersion = (version: keyof BibleVersions) => {
        setVerseLoading(true);
        setTimeout(() => {
            setBibleVersion(version);
            setVerseLoading(false);
        }, 600);
    };

    const addNewScripture = () => {
        if (
            newVerse.reference &&
            Object.values(newVerse.versions).some((v) => v !== "")
        ) {
            setScriptureDB((prev) => ({
                ...prev,
                [newVerse.reference]: newVerse.versions,
            }));
            setNewVerse({
                reference: "",
                versions: {
                    KJV: "",
                    NKJV: "",
                    NIV: "",
                    ESV: "",
                    AMP: "",
                    NLT: "",
                },
            });
            setEditMode(false);
        }
    };

    const updateVerseVersion = (version: keyof BibleVersions, text: string) => {
        setNewVerse((prev) => ({
            ...prev,
            versions: { ...prev.versions, [version]: text },
        }));
    };

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined;
        if (quizActive && timeLeft > 0 && !showResults) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endQuiz();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [quizActive, timeLeft, showResults]);

    const startQuiz = () => {
        setQuizActive(true);
        setCurrentQuestion(0);
        setScore(0);
        setTimeLeft(50);
        setShowResults(false);
    };

    const checkAnswer = (choice: number) => {
        if (!quizActive || showResults) return;
        const correct = quizQuestions[currentQuestion].correct === choice;
        const timeBonus = Math.floor(timeLeft / 10);
        const points = correct ? 10 + timeBonus : 0;
        if (correct) setScore((prev) => prev + points);
        if (currentQuestion < quizQuestions.length - 1) {
            setTimeout(() => setCurrentQuestion((prev) => prev + 1), 1000);
        } else {
            setTimeout(() => endQuiz(), 1000);
        }
    };

    const endQuiz = () => {
        setQuizActive(false);
        setShowResults(true);
    };

    const addCommitment = () => {
        if (commitmentInput.trim()) {
            setCommitments((prev) => [
                ...prev,
                {
                    text: commitmentInput,
                    date: new Date().toLocaleDateString(),
                },
            ]);
            setCommitmentInput("");
        }
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === "M") {
                e.preventDefault();
                handleTabChange("manage");
            }
            if (e.ctrlKey && e.shiftKey && e.key === "E") {
                e.preventDefault();
                setEditingContent(editingContent ? null : activeTab);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [editingContent, activeTab]);

    const updateContent = (field: string, value: string) =>
        setContentData((prev) => ({ ...prev, [field]: value }));
    const updateLessonPoint = (index: number, field: string, value: string) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === index ? { ...point, [field]: value } : point
            ),
        }));
    };
    const updatePrayerPoint = (index: number, value: string) => {
        setContentData((prev) => ({
            ...prev,
            prayerPoints: prev.prayerPoints.map((prayer, i) =>
                i === index ? value : prayer
            ),
        }));
    };
    const updateLessonSubPoint = (
        pointIndex: number,
        subIndex: number,
        field: string,
        value: string
    ) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.map((sub, j) =>
                              j === subIndex ? { ...sub, [field]: value } : sub
                          ),
                      }
                    : point
            ),
        }));
    };
    const addLessonSubPoint = (pointIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: [
                              ...point.subPoints,
                              {
                                  title: "New Point",
                                  content: "",
                                  scripture: "",
                              },
                          ],
                      }
                    : point
            ),
        }));
    };
    const deleteLessonSubPoint = (pointIndex: number, subIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.filter(
                              (_, j) => j !== subIndex
                          ),
                      }
                    : point
            ),
        }));
    };
    const addPrayerPoint = () =>
        setContentData((prev) => ({
            ...prev,
            prayerPoints: [...prev.prayerPoints, "New prayer point..."],
        }));

    const PAYSTACK_PUBLIC_KEY =
        "pk_test_bed97038ebcf74b30219ed0500cfffc6e80948f1";
    const PAYMENT_AMOUNT = 500000;

    const handlePaystackSuccess = (reference: unknown) => {
        console.log("Payment successful:", reference);
        setIsPaid(true);
        setShowPaymentGate(false);
    };

    const handlePaystackClose = () => console.log("Payment closed");

    const initializePaystack = () => {
        if (!window.PaystackPop) {
            alert("Paystack script not loaded!");
            return;
        }
        const paystack = window.PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: "user@example.com",
            amount: PAYMENT_AMOUNT,
            currency: "NGN",
            reference: "SSA_" + Math.floor(Math.random() * 1000000000 + 1),
            onClose: () => handlePaystackClose(),
            callback: (transaction: PaystackResponse) =>
                handlePaystackSuccess(transaction),
        });
        paystack.openIframe();
    };

    const handleFreePlan = () => {
        setShowPaymentGate(false);
        setIsPaid(false);
    };

    const themeClasses = darkMode
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 text-white"
        : "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 text-gray-900";

    if (appLoading) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center z-50">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-20 h-20 object-contain"
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full border-4 border-white/30 animate-ping"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="w-40 h-40 rounded-full border-4 border-white/20 animate-ping"
                                style={{ animationDelay: "0.3s" }}
                            ></div>
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Life Gate Ministries Worldwide
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                        Sunday School Lessons
                    </p>
                    <div className="text-white/80 mb-6 text-lg animate-pulse">
                        Loading Sunday School Lesson...
                    </div>
                    <div className="w-64 mx-auto bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 ease-out shadow-lg"
                            style={{ width: `${loadingProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-white/70 mt-3 text-sm">
                        {loadingProgress}%
                    </p>
                </div>
            </div>
        );
    }

    if (showPaymentGate) {
        return (
            <div
                className={`min-h-screen ${themeClasses} flex items-center justify-center p-4 relative overflow-hidden`}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                    <div
                        className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
                        style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                        className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse"
                        style={{ animationDelay: "2s" }}
                    ></div>
                </div>
                <div className="max-w-4xl w-full relative z-10">
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/20">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Sunday School Lesson
                        </h1>
                        <p className="text-xl opacity-80">
                            Your Position About Jesus Christ - Part 1
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Free Access
                                    </h3>
                                    <Unlock
                                        className="text-green-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦0
                                    </p>
                                    <p className="opacity-70">View Only Mode</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Read all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Take interactive quizzes</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No content editing
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No scripture management
                                        </span>
                                    </li>
                                </ul>
                                <button
                                    onClick={handleFreePlan}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Continue Free
                                </button>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    BEST VALUE
                                </div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Premium Access
                                    </h3>
                                    <Lock
                                        className="text-purple-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦5,000
                                    </p>
                                    <p className="opacity-70">Full Access</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Everything in Free</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Edit all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Manage Bible scriptures</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Save your commitments</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Priority support</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={initializePaystack}
                                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Unlock Premium
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-center mt-8 opacity-70 text-sm">
                        Secure payment powered by Paystack • All transactions
                        are encrypted
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen ${themeClasses} transition-all duration-500 relative`}
            style={{ fontSize: `${fontSize}px` }}
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-0 left-1/4 animate-pulse"></div>
                <div
                    className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl bottom-0 right-1/4 animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>
            <Header
                logo={logo}
                contentData={contentData}
                fontSize={fontSize}
                adjustFontSize={adjustFontSize}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
            />
            <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {contentData.lessonTitle}
                </h2>
                <div className="flex gap-2 mb-6 overflow-x-auto flex-nowrap md:flex-wrap justify-start md:justify-center scrollbar-hide backdrop-blur-sm bg-white/5 p-2 rounded-2xl border border-white/10">
                    {[
                        "intro",
                        "lesson",
                        "conclusion",
                        "application",
                        "quiz",
                        "prayer",
                    ].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all flex-shrink-0 ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : darkMode
                                    ? "bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10"
                                    : "bg-black/10 backdrop-blur-md hover:bg-black/20 border border-black/10"
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                    {isPaid && (
                        <button
                            onClick={() => handleTabChange("manage")}
                            className={`px-2 py-3 rounded-xl font-semibold transition-all flex-shrink-0 opacity-0 hover:opacity-10 ${
                                activeTab === "manage"
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : "bg-white/10 backdrop-blur-md"
                            }`}
                            title="Admin"
                            style={{ width: "40px" }}
                        >
                            <Edit2 size={16} className="mx-auto" />
                        </button>
                    )}
                </div>
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                )}
                {!loading && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
                        {activeTab === "intro" && (
                            <div className="space-y-6">
                                {editingContent === "intro" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-blue-900/30"
                                            : "bg-blue-50"
                                    } p-6 rounded-lg border-l-4 border-blue-600`}
                                >
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <BookOpen className="text-blue-600" />{" "}
                                        Memory Verse
                                    </h3>
                                    {editingContent === "intro" ? (
                                        <textarea
                                            value={contentData.memoryVerse}
                                            onChange={(e) =>
                                                updateContent(
                                                    "memoryVerse",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-2 rounded-lg border text-xl italic mb-4 ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            rows={2}
                                        />
                                    ) : (
                                        <blockquote className="text-xl italic mb-4">
                                            "{contentData.memoryVerse}"
                                        </blockquote>
                                    )}
                                    <button
                                        onClick={() =>
                                            showBibleVersions(
                                                contentData.memoryVerseRef
                                            )
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <BookOpen size={16} />
                                        Read {contentData.memoryVerseRef}
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Text: Luke 15:1-2
                                    </h3>
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() =>
                                                showBibleVersions("Luke 15:1-2")
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                        >
                                            <BookOpen size={16} />
                                            Read Luke 15:1-2
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Introduction
                                    </h3>
                                    {editingContent === "intro" ? (
                                        <textarea
                                            value={contentData.introduction}
                                            onChange={(e) =>
                                                updateContent(
                                                    "introduction",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            rows={6}
                                        />
                                    ) : (
                                        <p className="leading-relaxed">
                                            {contentData.introduction}
                                        </p>
                                    )}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {contentData.introScriptures.map(
                                            (scripture) => (
                                                <button
                                                    key={scripture}
                                                    onClick={() =>
                                                        showBibleVersions(
                                                            scripture
                                                        )
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                >
                                                    <BookOpen size={14} />
                                                    {scripture}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-green-900/30"
                                            : "bg-green-50"
                                    } p-6 rounded-lg`}
                                >
                                    <h3 className="text-xl font-bold mb-3">
                                        Aims and Objectives
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <strong className="text-green-700 dark:text-green-400">
                                                AIMS:
                                            </strong>
                                            {editingContent === "intro" ? (
                                                <textarea
                                                    value={contentData.aims}
                                                    onChange={(e) =>
                                                        updateContent(
                                                            "aims",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                    rows={3}
                                                />
                                            ) : (
                                                <p>{contentData.aims}</p>
                                            )}
                                        </div>
                                        <div>
                                            <strong className="text-green-700 dark:text-green-400">
                                                OBJECTIVES:
                                            </strong>
                                            {editingContent === "intro" ? (
                                                <textarea
                                                    value={
                                                        contentData.objectives
                                                    }
                                                    onChange={(e) =>
                                                        updateContent(
                                                            "objectives",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                    rows={2}
                                                />
                                            ) : (
                                                <p>{contentData.objectives}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "lesson" && (
                            <div className="space-y-6">
                                {editingContent === "lesson" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Lesson Content
                                </h3>
                                {editingContent === "lesson" ? (
                                    <textarea
                                        value={contentData.lessonIntro}
                                        onChange={(e) =>
                                            updateContent(
                                                "lessonIntro",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border mb-4 ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={3}
                                    />
                                ) : (
                                    <p className="leading-relaxed mb-4">
                                        {contentData.lessonIntro}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.lessonIntroScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </p>
                                )}
                                <div className="space-y-6">
                                    {contentData.lessonPoints.map(
                                        (section, idx) => (
                                            <div
                                                key={idx}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-gray-50"
                                                } p-5 rounded-lg`}
                                            >
                                                {editingContent === "lesson" ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={
                                                                section.title
                                                            }
                                                            onChange={(e) =>
                                                                updateLessonPoint(
                                                                    idx,
                                                                    "title",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`w-full px-3 py-2 rounded-lg border mb-3 text-xl font-semibold ${
                                                                darkMode
                                                                    ? "bg-gray-800 border-gray-600"
                                                                    : "bg-white border-gray-300"
                                                            }`}
                                                        />
                                                        {section.content && (
                                                            <textarea
                                                                value={
                                                                    section.content
                                                                }
                                                                onChange={(e) =>
                                                                    updateLessonPoint(
                                                                        idx,
                                                                        "content",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`w-full px-3 py-2 rounded-lg border mb-3 ${
                                                                    darkMode
                                                                        ? "bg-gray-800 border-gray-600"
                                                                        : "bg-white border-gray-300"
                                                                }`}
                                                                rows={3}
                                                            />
                                                        )}
                                                        <div className="ml-6 space-y-3 mt-3">
                                                            {section.subPoints.map(
                                                                (
                                                                    subPoint,
                                                                    subIdx
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            subIdx
                                                                        }
                                                                        className={`${
                                                                            darkMode
                                                                                ? "bg-gray-800"
                                                                                : "bg-white"
                                                                        } p-3 rounded-lg`}
                                                                    >
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <span className="text-sm font-bold text-yellow-600">
                                                                                {String.fromCharCode(
                                                                                    97 +
                                                                                        subIdx
                                                                                )}

                                                                                .
                                                                            </span>
                                                                            <button
                                                                                onClick={() =>
                                                                                    deleteLessonSubPoint(
                                                                                        idx,
                                                                                        subIdx
                                                                                    )
                                                                                }
                                                                                className="text-red-600 hover:text-red-800"
                                                                            >
                                                                                <X
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.title
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "title",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point title"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm font-semibold ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                        <textarea
                                                                            value={
                                                                                subPoint.content
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "content",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point content"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                            rows={
                                                                                2
                                                                            }
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.scripture ||
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "scripture",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Scripture reference (optional)"
                                                                            className={`w-full px-3 py-1 rounded border text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    addLessonSubPoint(
                                                                        idx
                                                                    )
                                                                }
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                            >
                                                                <Plus
                                                                    size={14}
                                                                />{" "}
                                                                Add Sub-point
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h4 className="text-xl font-semibold mb-2">
                                                            {idx + 1}.{" "}
                                                            {section.title}
                                                        </h4>
                                                        {section.content && (
                                                            <p className="leading-relaxed mb-3">
                                                                {
                                                                    section.content
                                                                }
                                                            </p>
                                                        )}
                                                        {section.scriptures &&
                                                            section.scriptures
                                                                .length > 0 && (
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    {section.scriptures.map(
                                                                        (
                                                                            scripture
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    scripture
                                                                                }
                                                                                onClick={() =>
                                                                                    showBibleVersions(
                                                                                        scripture
                                                                                    )
                                                                                }
                                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition flex items-center gap-2 text-sm"
                                                                            >
                                                                                <BookOpen
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                                {
                                                                                    scripture
                                                                                }
                                                                            </button>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        {section.subPoints &&
                                                            section.subPoints
                                                                .length > 0 && (
                                                                <ol className="list-[lower-alpha] ml-6 space-y-3 mt-3">
                                                                    {section.subPoints.map(
                                                                        (
                                                                            subPoint,
                                                                            subIdx
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    subIdx
                                                                                }
                                                                            >
                                                                                <strong>
                                                                                    {
                                                                                        subPoint.title
                                                                                    }

                                                                                    :
                                                                                </strong>{" "}
                                                                                {
                                                                                    subPoint.content
                                                                                }
                                                                                {subPoint.scripture && (
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            if (
                                                                                                subPoint.scripture
                                                                                            )
                                                                                                showBibleVersions(
                                                                                                    subPoint.scripture
                                                                                                );
                                                                                        }}
                                                                                        className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                                                                                    >
                                                                                        📖
                                                                                        Read{" "}
                                                                                        {
                                                                                            subPoint.scripture
                                                                                        }
                                                                                    </button>
                                                                                )}
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ol>
                                                            )}
                                                    </>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "conclusion" && (
                            <div className="space-y-4">
                                {editingContent === "conclusion" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Conclusion
                                </h3>
                                {editingContent === "conclusion" ? (
                                    <textarea
                                        value={contentData.conclusion}
                                        onChange={(e) =>
                                            updateContent(
                                                "conclusion",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border text-lg ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={4}
                                    />
                                ) : (
                                    <p className="text-lg leading-relaxed">
                                        {contentData.conclusion}
                                    </p>
                                )}
                                {contentData.conclusionScriptures &&
                                    contentData.conclusionScriptures.length >
                                        0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.conclusionScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        )}
                        {activeTab === "application" && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold mb-4">
                                    Personal Application
                                </h3>
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-gray-700"
                                            : "bg-gradient-to-r from-blue-50 to-indigo-50"
                                    } p-6 rounded-lg`}
                                >
                                    <h4 className="text-xl font-semibold mb-4">
                                        What is your position about Jesus?
                                    </h4>
                                    <p className="mb-4">
                                        Describe your position about Jesus to
                                        the unsaved.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={faithRating}
                                            onChange={(e) =>
                                                setFaithRating(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="flex-1"
                                        />
                                        <span className="text-2xl font-bold text-blue-600">
                                            {faithRating}/10
                                        </span>
                                    </div>
                                    <p className="mt-3 text-sm italic">
                                        {faithRating >= 8
                                            ? "Excellent vigilance! Keep watching!"
                                            : faithRating >= 5
                                            ? "Good awareness! Stay alert!"
                                            : "Increase your watchfulness!"}
                                    </p>
                                </div>
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-gray-700"
                                            : "bg-white border border-gray-200"
                                    } p-6 rounded-lg`}
                                >
                                    <h4 className="text-xl font-semibold mb-4">
                                        Personal Commitments
                                    </h4>
                                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                        <input
                                            type="text"
                                            value={commitmentInput}
                                            onChange={(e) =>
                                                setCommitmentInput(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter your commitment..."
                                            className={`flex-1 px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            onKeyPress={(e) =>
                                                e.key === "Enter" &&
                                                addCommitment()
                                            }
                                        />
                                        <button
                                            onClick={addCommitment}
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition flex items-center justify-center gap-2 w-full sm:w-auto"
                                        >
                                            <Save size={16} /> Save
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {commitments.map((commitment, idx) => (
                                            <div
                                                key={idx}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-800"
                                                        : "bg-gray-50"
                                                } p-3 rounded-lg flex items-start gap-3`}
                                            >
                                                <CheckCircle
                                                    className="text-green-600 mt-1"
                                                    size={20}
                                                />
                                                <div className="flex-1">
                                                    <p>{commitment.text}</p>
                                                    <p className="text-xs opacity-70 mt-1">
                                                        {commitment.date}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "quiz" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">
                                        Speed Quiz Challenge
                                    </h3>
                                    {quizActive && (
                                        <div className="flex gap-4 items-center">
                                            <div className="flex items-center gap-2">
                                                <Clock className="text-blue-600" />
                                                <span className="text-xl font-bold">
                                                    {timeLeft}s
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Award className="text-yellow-600" />
                                                <span className="text-xl font-bold">
                                                    {score}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {!quizActive && !showResults && (
                                    <div className="text-center py-12">
                                        <Award
                                            size={64}
                                            className="mx-auto mb-4 text-yellow-600"
                                        />
                                        <h4 className="text-2xl font-bold mb-4">
                                            Ready to Test Your Knowledge?
                                        </h4>
                                        <p className="mb-6 text-lg">
                                            Answer quickly for bonus points!
                                        </p>
                                        <button
                                            onClick={startQuiz}
                                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-xl font-semibold transition transform hover:scale-105"
                                        >
                                            Start Quiz
                                        </button>
                                    </div>
                                )}
                                {quizActive && !showResults && (
                                    <div>
                                        <div
                                            className={`${
                                                darkMode
                                                    ? "bg-gray-700"
                                                    : "bg-blue-50"
                                            } p-6 rounded-lg mb-6`}
                                        >
                                            <h4 className="text-xl font-semibold mb-4">
                                                Question {currentQuestion + 1}{" "}
                                                of {quizQuestions.length}
                                            </h4>
                                            <p className="text-lg mb-6">
                                                {
                                                    quizQuestions[
                                                        currentQuestion
                                                    ].q
                                                }
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {quizQuestions[
                                                    currentQuestion
                                                ].a.map((answer, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() =>
                                                            checkAnswer(idx)
                                                        }
                                                        className={`${
                                                            darkMode
                                                                ? "bg-gray-800 hover:bg-gray-900"
                                                                : "bg-white hover:bg-gray-50"
                                                        } p-4 rounded-lg border-2 border-blue-600 transition transform hover:scale-105 text-left`}
                                                    >
                                                        <span className="font-bold text-blue-600 mr-2">
                                                            {String.fromCharCode(
                                                                65 + idx
                                                            )}
                                                            .
                                                        </span>
                                                        {answer}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showResults && (
                                    <div className="text-center space-y-6">
                                        <Award
                                            size={80}
                                            className="mx-auto text-yellow-600"
                                        />
                                        <h4 className="text-3xl font-bold">
                                            Quiz Complete!
                                        </h4>
                                        <div
                                            className={`${
                                                darkMode
                                                    ? "bg-gray-700"
                                                    : "bg-gradient-to-r from-blue-50 to-indigo-50"
                                            } p-8 rounded-lg`}
                                        >
                                            <p className="text-5xl font-bold text-blue-600 mb-2">
                                                {score}
                                            </p>
                                            <p className="text-xl">
                                                Final Score
                                            </p>
                                            <p className="mt-4 text-lg">
                                                {score >= 100
                                                    ? "Outstanding! Excellent knowledge!"
                                                    : score >= 60
                                                    ? "Great work! Keep studying!"
                                                    : "Good effort! Review the lesson."}
                                            </p>
                                        </div>
                                        <button
                                            onClick={startQuiz}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "prayer" && (
                            <div className="space-y-4">
                                {editingContent === "prayer" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-6">
                                    Prayer Points
                                </h3>
                                {contentData.prayerPoints.map((prayer, idx) => (
                                    <div
                                        key={idx}
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-gradient-to-r from-purple-50 to-pink-50"
                                        } p-6 rounded-lg border-l-4 border-purple-600`}
                                    >
                                        {editingContent === "prayer" ? (
                                            <textarea
                                                value={prayer}
                                                onChange={(e) =>
                                                    updatePrayerPoint(
                                                        idx,
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-3 py-2 rounded-lg border ${
                                                    darkMode
                                                        ? "bg-gray-800 border-gray-600"
                                                        : "bg-white border-gray-300"
                                                }`}
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-lg leading-relaxed">
                                                {prayer}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                {editingContent === "prayer" && (
                                    <button
                                        onClick={addPrayerPoint}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add Prayer Point
                                    </button>
                                )}
                            </div>
                        )}
                        {activeTab === "manage" && isPaid && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">
                                        Manage Scriptures
                                    </h3>
                                    <button
                                        onClick={() => setEditMode(!editMode)}
                                        className={`${
                                            editMode
                                                ? "bg-red-600 hover:bg-red-700"
                                                : "bg-green-600 hover:bg-green-700"
                                        } text-white px-4 py-2 rounded-lg transition flex items-center gap-2`}
                                    >
                                        {editMode ? (
                                            <>
                                                <X size={16} /> Cancel
                                            </>
                                        ) : (
                                            <>
                                                <Edit2 size={16} /> Add New
                                            </>
                                        )}
                                    </button>
                                </div>
                                {editMode && (
                                    <div
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-blue-50"
                                        } p-6 rounded-lg space-y-4`}
                                    >
                                        <input
                                            type="text"
                                            value={newVerse.reference}
                                            onChange={(e) =>
                                                setNewVerse({
                                                    ...newVerse,
                                                    reference: e.target.value,
                                                })
                                            }
                                            placeholder="Scripture Reference (e.g., John 3:16)"
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                        />
                                        {(
                                            [
                                                "KJV",
                                                "NKJV",
                                                "NIV",
                                                "ESV",
                                                "AMP",
                                                "NLT",
                                            ] as const
                                        ).map((version) => (
                                            <div key={version}>
                                                <label className="block font-semibold mb-2">
                                                    {version}
                                                </label>
                                                <textarea
                                                    value={
                                                        newVerse.versions[
                                                            version
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        updateVerseVersion(
                                                            version,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={`Enter ${version} text...`}
                                                    rows={3}
                                                    className={`w-full px-4 py-2 rounded-lg border ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={addNewScripture}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2"
                                        >
                                            <Save size={16} /> Save Scripture
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    {Object.keys(scriptureDB).map(
                                        (reference) => (
                                            <div
                                                key={reference}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-white border border-gray-200"
                                                } p-4 rounded-lg`}
                                            >
                                                <h4 className="font-bold text-lg mb-2">
                                                    {reference}
                                                </h4>
                                                <button
                                                    onClick={() =>
                                                        showBibleVersions(
                                                            reference
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    View All Versions →
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "manage" && !isPaid && (
                            <div className="text-center py-12">
                                <Lock
                                    size={64}
                                    className="mx-auto mb-4 text-purple-400"
                                />
                                <h3 className="text-2xl font-bold mb-4">
                                    Premium Feature
                                </h3>
                                <p className="mb-6">
                                    Upgrade to Premium to access scripture
                                    management
                                </p>
                                <button
                                    onClick={() => setShowPaymentGate(true)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold"
                                >
                                    Unlock Now
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showVerseModal && selectedVerse && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowVerseModal(false)}
                >
                    <div
                        className={`${
                            darkMode ? "bg-gray-800" : "bg-white"
                        } rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold">
                                    {selectedVerse}
                                </h3>
                                <button
                                    onClick={() => setShowVerseModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                            {(
                                [
                                    "KJV",
                                    "NKJV",
                                    "NIV",
                                    "ESV",
                                    "AMP",
                                    "NLT",
                                ] as const
                            ).map((version) => (
                                <button
                                    key={version}
                                    onClick={() => changeBibleVersion(version)}
                                    disabled={verseLoading}
                                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                                        bibleVersion === version
                                            ? "bg-blue-600 text-white"
                                            : darkMode
                                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    } ${
                                        verseLoading
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {version}
                                </button>
                            ))}
                        </div>
                        <div
                            className="p-6 overflow-y-auto"
                            style={{ maxHeight: "calc(85vh - 180px)" }}
                        >
                            {verseLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="relative w-16 h-16 mb-4">
                                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <p className="text-gray-500 animate-pulse">
                                        Loading scripture...
                                    </p>
                                </div>
                            ) : selectedVerse &&
                              scriptureDB[selectedVerse] &&
                              scriptureDB[selectedVerse][bibleVersion] ? (
                                <div className="text-lg leading-relaxed animate-fadeIn">
                                    {formatScriptureText(
                                        scriptureDB[selectedVerse][bibleVersion]
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Translation not available
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SundaySchoolApp;
