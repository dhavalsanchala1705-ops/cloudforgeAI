from typing import List, Dict, Any

# Icon to color mapping for visual differentiation
ICON_COLORS = {
    "ec2": "#FF9900",
    "ecs": "#FF9900",
    "eks": "#FF9900",
    "lambda": "#FF9900",
    "rds": "#3B48CC",
    "dynamodb": "#3B48CC",
    "elasticache": "#3B48CC",
    "s3": "#7AA116",
    "cloudfront": "#8C4FFF",
    "alb": "#E7157B",
    "cognito": "#C7131F",
    "api-gateway": "#E7157B",
    "sqs": "#FF4F8B",
    "sns": "#FF4F8B",
    "ses": "#FF4F8B",
    "waf": "#DD344C",
    "cloudwatch": "#E7157B",
    "route53": "#8C4FFF",
    "nat-gateway": "#8C4FFF",
    "acm": "#DD344C",
    "secrets-manager": "#DD344C",
}


def build_diagram(services: List[Dict[str, Any]]) -> tuple[List[Dict], List[Dict]]:
    """Convert service list into React Flow nodes and edges."""
    nodes = []
    edges = []

    # Group services into logical layers
    layer_order = [
        "cloudfront",
        "route53",
        "alb",
        "api-gateway",
        "cognito",
        "waf",
        "acm",
        "ec2",
        "ecs",
        "eks",
        "lambda",
        "rds",
        "dynamodb",
        "elasticache",
        "s3",
        "cloudwatch",
        "sqs",
        "sns",
        "ses",
        "nat-gateway",
        "secrets-manager",
    ]

    sorted_services = sorted(
        services,
        key=lambda s: layer_order.index(s["icon"])
        if s["icon"] in layer_order
        else 99,
    )

    x_positions = [100, 350, 600, 850]
    cols: List[List[Dict]] = [[], [], [], []]

    for i, svc in enumerate(sorted_services):
        col = i % 4
        cols[col].append(svc)

    node_id_map: Dict[str, str] = {}
    for col_idx, col_services in enumerate(cols):
        for row_idx, svc in enumerate(col_services):
            node_id = f"node-{col_idx}-{row_idx}"
            node_id_map[svc["aws_service"]] = node_id
            nodes.append(
                {
                    "id": node_id,
                    "type": "serviceNode",
                    "position": {
                        "x": x_positions[col_idx],
                        "y": 100 + row_idx * 150,
                    },
                    "data": {
                        "label": svc["name"],
                        "aws_service": svc["aws_service"],
                        "rationale": svc["rationale"],
                        "monthly_cost_usd": svc["monthly_cost_usd"],
                        "icon": svc["icon"],
                        "color": ICON_COLORS.get(svc["icon"], "#888"),
                    },
                }
            )

    # Create sequential edges between adjacent nodes
    all_node_ids = [n["id"] for n in nodes]
    for i in range(len(all_node_ids) - 1):
        edges.append(
            {
                "id": f"edge-{i}",
                "source": all_node_ids[i],
                "target": all_node_ids[i + 1],
                "animated": True,
                "style": {"stroke": "#6366f1"},
            }
        )

    return nodes, edges
