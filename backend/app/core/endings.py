import json
import os
from typing import Dict, Any, List

ENDING_LIBRARY = [
    {
        "id": "perfect_ending",
        "title": "完美收官",
        "description": "你在军训中各方面都表现出色：纪律严明、体能充沛、团结同学、尊重教官。你不仅完成了训练，更在会操表演中为连队赢得了荣誉。你的军训堪称完美，这段经历将成为你人生中闪亮的勋章。",
        "condition": {"discipline": {"gte": 90}, "stamina": {"gte": 80}, "instructor_favor": {"gte": 90}, "classmate_relation": {"gte": 80}, "health": {"gte": 70}},
        "priority": 120,
        "tags": ["完美", "全能"],
    },
    {
        "id": "excellent_pacesetter",
        "title": "优秀标兵",
        "description": "你以顽强的意志和标准的动作征服了教官和同学们，被评为\"优秀标兵\"。你的坚持成为了连队的榜样，这份荣誉将伴随你走过未来的每一个挑战。",
        "condition": {"discipline": {"gte": 80}, "instructor_favor": {"gte": 80}, "flags": {"is_pacesetter": True}},
        "priority": 100,
        "tags": ["荣誉", "坚持"],
    },
    {
        "id": "model_monitor",
        "title": "模范班长",
        "description": "作为临时班长，你以身作则，认真负责，赢得了同学们的信任和教官的认可。你的组织能力和领导力在军训中得到了充分展现，你是一个值得信赖的带头人。",
        "condition": {"flags": {"is_monitor": True}, "discipline": {"gte": 70}, "instructor_favor": {"gte": 70}},
        "priority": 95,
        "tags": ["责任", "领导力"],
    },
    {
        "id": "grateful_to_instructor",
        "title": "师生情深",
        "description": "你与教官建立了深厚的感情，离别时依依不舍。教官的教诲将永远激励你前行。你懂得了尊师重道，也收获了一份特殊的友谊。",
        "condition": {"instructor_favor": {"gte": 85}, "mood": {"gte": 60}, "flags": {"attended_opening": True}},
        "priority": 95,
        "tags": ["师生", "感恩"],
    },
    {
        "id": "unyielding_spirit",
        "title": "不屈不挠",
        "description": "尽管军训中你经历了伤病、疲惫和挫折，但你从未放弃。你用实际行动诠释了\"流血流汗不流泪，掉皮掉肉不掉队\"的精神。你的坚韧让所有人动容。",
        "condition": {"flags": {"injured": True}, "health": {"gte": 40}, "discipline": {"gte": 50}},
        "priority": 90,
        "tags": ["坚韧", "毅力"],
    },
    {
        "id": "positive_mindset",
        "title": "乐观向上",
        "description": "无论训练多苦多累，你总能保持乐观的心态，用笑容感染身边的人。你相信苦中作乐才是生活的智慧，这份积极的心态让你顺利完成了军训。",
        "condition": {"mood": {"gte": 85}, "stamina": {"gte": 40}, "health": {"gte": 40}},
        "priority": 90,
        "tags": ["乐观", "心态"],
    },
    {
        "id": "kindness_hero",
        "title": "助人为乐",
        "description": "军训期间，你多次主动帮助身体不适的同学，递水、搀扶、鼓励。你的善良和热心温暖了周围的人，你成为了大家心中的\"小太阳\"。",
        "condition": {"flags": {"helped_classmate": True}, "classmate_relation": {"gte": 70}},
        "priority": 92,
        "tags": ["善良", "互助"],
    },
    {
        "id": "team_spirit",
        "title": "团队之魂",
        "description": "在无数次齐步走、正步走中，你深刻体会到了团队协作的力量。你与同学们心往一处想、劲往一处使，共同创造了整齐划一的队列。这份团队精神将让你受益终身。",
        "condition": {"classmate_relation": {"gte": 70}, "discipline": {"gte": 60}, "flags": {"formation": "normal"}},
        "priority": 88,
        "tags": ["团队", "协作"],
    },
    {
        "id": "friendship_forever",
        "title": "友谊长存",
        "description": "一起流汗、一起欢笑、一起咬牙坚持的日子，让你收获了一群并肩作战的好朋友。你们互相扶持、互相鼓励，这份友谊将是你军训中最宝贵的财富。",
        "condition": {"classmate_relation": {"gte": 80}, "mood": {"gte": 50}},
        "priority": 85,
        "tags": ["友谊", "团结"],
    },
    {
        "id": "neat_room_king",
        "title": "内务标兵",
        "description": "你叠的被子像豆腐块，物品摆放整齐划一，多次受到教官表扬。你明白了细节决定成败，良好的习惯会让你终身受益。",
        "condition": {"flags": {"neat_room": True}, "discipline": {"gte": 70}},
        "priority": 85,
        "tags": ["内务", "习惯"],
    },
    {
        "id": "artistic_star",
        "title": "才艺之星",
        "description": "在拉歌、才艺表演中，你勇敢展示自己，用歌声或笑话给大家带来了欢乐。你的自信和才华让军训生活更加多彩，你成为了连队的开心果。",
        "condition": {"flags": {"performed": True}, "mood": {"gte": 70}, "classmate_relation": {"gte": 60}},
        "priority": 82,
        "tags": ["才艺", "自信"],
    },
    {
        "id": "self_breakthrough",
        "title": "自我突破",
        "description": "曾经你觉得跑不动了、站不住了，但你咬牙坚持了下来。你突破了自己的极限，发现了内心深处的力量。今后无论遇到什么困难，你都会想起这段经历，勇敢面对。",
        "condition": {"stamina": {"gte": 70}, "discipline": {"gte": 70}, "health": {"gte": 50}, "flags": {"injured": False}},
        "priority": 85,
        "tags": ["突破", "潜力"],
    },
    {
        "id": "emergency_hero",
        "title": "紧急集合小能手",
        "description": "半夜紧急集合，你反应迅速、着装整齐，第一个到达操场，为连队争了光。你的高效和冷静让人刮目相看。",
        "condition": {"flags": {"emergency_ready": True}, "discipline": {"gte": 60}, "stamina": {"gte": 50}},
        "priority": 80,
        "tags": ["效率", "冷静"],
    },
    {
        "id": "growth_transformation",
        "title": "成长蜕变",
        "description": "军训前，你或许还有些懒散和迷茫；军训后，你变得更加自律、坚强。你学会了在疲惫中坚持，在困难前不退缩。这段经历让你完成了从青涩到成熟的蜕变。",
        "condition": {"discipline": {"gte": 70}, "stamina": {"gte": 60}, "mood": {"gte": 60}},
        "priority": 80,
        "tags": ["成长", "自律"],
    },
    {
        "id": "heatstroke_survivor",
        "title": "战胜中暑",
        "description": "你在烈日下头晕目眩，但你没有硬撑，及时报告并休息，调整后重新归队。你学会了科学应对困难，保护自己才能更好地战斗。",
        "condition": {"flags": {"rested": True}, "health": {"gte": 50}, "discipline": {"gte": 50}},
        "priority": 78,
        "tags": ["科学", "恢复"],
    },
    {
        "id": "gun_squad_glory",
        "title": "持枪方阵的荣耀",
        "description": "你选择了持枪方阵，用汗水浇灌出整齐划一的枪线。在会操表演中，你们方阵的英姿震撼全场。你为自己是其中一员而自豪，这份荣耀将永远铭记。",
        "condition": {"flags": {"formation": "gun"}, "discipline": {"gte": 70}, "stamina": {"gte": 50}},
        "priority": 75,
        "tags": ["方阵", "荣耀"],
    },
    {
        "id": "stick_squad_strength",
        "title": "防暴棍方阵的力量",
        "description": "防暴棍的训练让你学会了力量与技巧的结合。你在对抗演练中表现出色，方阵的默契配合令人赞叹。你变得更加果敢坚毅，面对困难敢于亮剑。",
        "condition": {"flags": {"formation": "stick"}, "discipline": {"gte": 70}, "health": {"gte": 50}},
        "priority": 75,
        "tags": ["方阵", "勇气"],
    },
    {
        "id": "normal_squad_solidarity",
        "title": "正常连队的扎实",
        "description": "在正常连队中，你脚踏实地、勤学苦练，把每一个基础动作都练到极致。你的扎实和沉稳赢得了教官的称赞。你明白，伟大源于平凡，坚持就是胜利。",
        "condition": {"flags": {"formation": "normal"}, "discipline": {"gte": 70}, "mood": {"gte": 50}},
        "priority": 75,
        "tags": ["扎实", "坚持"],
    },
    {
        "id": "heart_of_gratitude",
        "title": "感恩之心",
        "description": "军训结束，你心中充满了感激。感谢教官的严格教导，感谢同学的陪伴帮助，感谢老师的关心支持。你学会了感恩，这会让你的未来更加温暖。",
        "condition": {"flags": {"attended_opening": True}, "mood": {"gte": 70}, "classmate_relation": {"gte": 60}},
        "priority": 70,
        "tags": ["感恩", "温暖"],
    },
    {
        "id": "overcoming_thirst",
        "title": "战胜干渴的意志",
        "description": "水壶见底、喉咙冒烟，但你仍然坚持训练，没有向困难低头。你学会了在逆境中忍耐和克服，这份意志力将帮助你在未来战胜更多的挑战。",
        "condition": {"thirst": {"gte": 70}, "stamina": {"gte": 50}, "discipline": {"gte": 60}},
        "priority": 65,
        "tags": ["意志", "忍耐"],
    },
    {
        "id": "perseverance_through_sweat",
        "title": "汗水浇灌的青春",
        "description": "烈日下的军姿、操场上的正步、夜晚的紧急集合……每一滴汗水都见证了你的努力。你没有虚度这段时光，你用汗水书写了一段无悔的青春篇章。",
        "condition": {"stamina": {"gte": 50}, "discipline": {"gte": 50}, "mood": {"gte": 40}},
        "priority": 60,
        "tags": ["青春", "努力"],
    },
    {
        "id": "full_attendance",
        "title": "全程坚守",
        "description": "整个军训期间，你没有缺席过一次训练，没有请过一次假。你用全勤诠释了什么是认真和负责。这份坚守让你赢得了所有人的尊重。",
        "condition": {"flags": {"rested": False, "injured": False}, "health": {"gte": 60}, "stamina": {"gte": 40}},
        "priority": 50,
        "tags": ["全勤", "坚守"],
    },
    {
        "id": "safe_completion",
        "title": "平安完成军训",
        "description": "你顺利完成了军训，虽然过程中没有突出的表现，但你的坚持和努力值得肯定。军训的结束是新的开始，愿你把军训中的收获带到未来的生活中。",
        "condition": {},
        "priority": 0,
        "tags": ["坚持", "完成"],
    },
]


def check_ending_condition(player: Dict[str, Any], condition: Dict[str, Any]) -> bool:
    for key, value in condition.items():
        if key == "flags":
            flags = player.get("flags", {})
            for flag_name, flag_value in value.items():
                if flags.get(flag_name) != flag_value:
                    return False
        else:
            if key not in player:
                return False
            actual = player[key]
            if isinstance(value, dict):
                if "gte" in value and actual < value["gte"]:
                    return False
                if "lte" in value and actual > value["lte"]:
                    return False
                if "eq" in value and actual != value["eq"]:
                    return False
            else:
                if actual != value:
                    return False
    return True


def generate_ending(player: Dict[str, Any], max_results: int = 3) -> List[Dict[str, str]]:
    matched = []
    for ending in ENDING_LIBRARY:
        if check_ending_condition(player, ending["condition"]):
            matched.append(ending)

    matched.sort(key=lambda x: x["priority"], reverse=True)

    seen = set()
    result = []
    for e in matched:
        if e["id"] not in seen:
            result.append({"title": e["title"], "description": e["description"], "tags": e.get("tags", [])})
            seen.add(e["id"])
        if len(result) >= max_results:
            break

    if not result:
        result.append({
            "title": "平安完成军训",
            "description": "你顺利完成了军训，虽然过程中没有突出的表现，但你的坚持和努力值得肯定。军训的结束是新的开始，愿你把军训中的收获带到未来的生活中。",
            "tags": ["坚持", "完成"],
        })
    return result


def generate_score(player: Dict[str, Any]) -> tuple:
    score = 0
    score += player.get("discipline", 0) * 0.2
    score += player.get("instructor_favor", 0) * 0.2
    score += player.get("classmate_relation", 0) * 0.2
    score += player.get("health", 0) * 0.1
    score += player.get("mood", 0) * 0.1

    flags = player.get("flags", {})
    if flags.get("is_pacesetter"):
        score += 15
    if flags.get("is_monitor"):
        score += 10
    if flags.get("injured"):
        score -= 10
    formation = flags.get("formation")
    if formation in ("gun", "stick"):
        score += 5
    if flags.get("well_prepared"):
        score += 5

    score = max(0, min(100, int(score)))
    if score >= 90:
        grade = "S"
    elif score >= 80:
        grade = "A"
    elif score >= 70:
        grade = "B"
    elif score >= 60:
        grade = "C"
    else:
        grade = "D"
    return score, grade
