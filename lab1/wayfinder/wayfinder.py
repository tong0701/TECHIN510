"""
GIX Wayfinder — campus resources for new students at the Global Innovation Exchange.
"""

import streamlit as st

RESOURCES = [
    {
        "name": "GIX Makerspace",
        "category": "Academic & labs",
        "location": "Building C, first floor",
        "description": "3D printers, soldering, basic tools, and project workspace for hardware prototypes.",
        "hours": "Mon–Fri 9:00–20:00 (card access after hours for enrolled students)",
    },
    {
        "name": "Bike storage",
        "category": "Getting around",
        "location": "Covered racks east of the main entrance",
        "description": "Secure covered racks; bring your own lock. Indoor bike room during heavy rain—ask front desk.",
        "hours": "24/7 access with building badge",
    },
    {
        "name": "Free printing (quota)",
        "category": "Printing & tech",
        "location": "Learning commons, printers A & B",
        "description": "Semester print quota for coursework; release jobs at any campus printer with your student login.",
        "hours": "Same as building hours (typically 7:00–22:00)",
    },
    {
        "name": "Quiet study alcoves",
        "category": "Study spaces",
        "location": "Floors 2–3, north wing",
        "description": "Small rooms and booth seating for focused work; first-come, not reservable.",
        "hours": "Building hours",
    },
    {
        "name": "Collaboration studios",
        "category": "Study spaces",
        "location": "Floor 2, central corridor",
        "description": "Whiteboards, screens, and seating for team meetings and design sprints.",
        "hours": "Building hours; some rooms bookable via calendar",
    },
    {
        "name": "Shared kitchen",
        "category": "Food & wellness",
        "location": "First floor, next to student lounge",
        "description": "Microwave, hot water, fridge space (labeled), dish soap and drying racks—clean up after yourself.",
        "hours": "7:00–22:00",
    },
    {
        "name": "Mail & package room",
        "category": "Logistics",
        "location": "Reception, Building A",
        "description": "Pick up packages with ID; Amazon lockers nearby for personal deliveries.",
        "hours": "Mon–Fri 10:00–16:00 (holiday hours posted)",
    },
    {
        "name": "Student lounge",
        "category": "Community",
        "location": "First floor, south atrium",
        "description": "Couches, games, and space to meet cohorts between classes.",
        "hours": "Building hours",
    },
    {
        "name": "IT help desk",
        "category": "Printing & tech",
        "location": "Learning commons desk",
        "description": "Wi‑Fi, VPN, laptop loans, and software questions for GIX programs.",
        "hours": "Mon–Thu 10:00–17:00, Fri 10:00–15:00",
    },
    {
        "name": "Wellness room",
        "category": "Food & wellness",
        "location": "Floor 2, room 204",
        "description": "Low-stimulation space for breaks; shoes off, silence phones.",
        "hours": "8:00–20:00",
    },
    {
        "name": "Career advising drop-in",
        "category": "Support",
        "location": "Student services suite",
        "description": "Résumé reviews and internship questions; check calendar for weekly hours.",
        "hours": "Wed 13:00–16:00 during term",
    },
]

assert all(
    r.get("name") and str(r.get("name", "")).strip() and r.get("category") and str(r.get("category", "")).strip()
    for r in RESOURCES
), "Every resource must have a non-empty name and category."


def matches_keyword(resource: dict, query: str) -> bool:
    if not query.strip():
        return True
    q = query.lower()
    haystack = " ".join(
        str(resource.get(k, "")) for k in ("name", "category", "location", "description", "hours")
    ).lower()
    return q in haystack


def main() -> None:
    st.set_page_config(page_title="GIX Wayfinder", page_icon="🧭", layout="wide")
    st.title("🧭 GIX Wayfinder")
    st.caption("Find campus resources fast—built for new students at GIX.")

    categories = sorted({r["category"] for r in RESOURCES})
    with st.sidebar:
        st.header("Filters")
        category_choice = st.selectbox(
            "Category",
            options=["All categories"] + categories,
            help="Show only resources in one category.",
        )

    search = st.text_input(
        "Search",
        placeholder="Try makerspace, bike, print, kitchen…",
        label_visibility="collapsed",
    )
    st.caption("Search matches name, category, location, description, and hours.")

    filtered = [
        r
        for r in RESOURCES
        if (category_choice == "All categories" or r["category"] == category_choice)
        and matches_keyword(r, search)
    ]

    if not filtered:
        st.info(
            "**No spots match yet.** Try a different keyword, pick **All categories**, "
            "or clear the search box to see everything again."
        )
        return

    st.success(f"Showing **{len(filtered)}** resource(s).")
    for r in filtered:
        with st.container(border=True):
            st.subheader(r["name"])
            st.markdown(f"**Category:** {r['category']}  \n**Where:** {r['location']}")
            st.markdown(r["description"])
            st.markdown(f"**Hours:** {r['hours']}")


if __name__ == "__main__":
    main()
