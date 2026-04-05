# GIX Purchase Tracker built with Streamlit.
# Students submit purchase requests through a one-page form.
# Dorothy (Program Coordinator) reviews, filters, and exports
# requests for weekly instructor approval.
# I manually added this comment and changed the submit button label below.

import uuid
from datetime import datetime
from pathlib import Path

import pandas as pd
import streamlit as st

# --- Config ---
BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "purchases.csv"

COLUMNS = [
    "Request ID",
    "Timestamp",
    "Team #",
    "CFO Name",
    "Provider/Supplier",
    "Item Name",
    "Quantity",
    "Unit Price ($)",
    "Total Price ($)",
    "Link to Purchase",
    "Notes",
    "Approval Status",
]

STATUS_OPTIONS = ["Pending", "Approved", "Rejected"]


def load_data():
    """Load purchase data from CSV, or create empty DataFrame if file doesn't exist."""
    if DATA_FILE.exists():
        df = pd.read_csv(DATA_FILE)
        migrated = False
        # Migrate older CSVs without Request ID
        if "Request ID" not in df.columns:
            df.insert(0, "Request ID", [str(uuid.uuid4()) for _ in range(len(df))])
            migrated = True
        else:
            mask = df["Request ID"].isna() | (df["Request ID"].astype(str).str.strip() == "")
            if mask.any():
                df.loc[mask, "Request ID"] = [str(uuid.uuid4()) for _ in range(int(mask.sum()))]
                migrated = True
        # Ensure column order
        for col in COLUMNS:
            if col not in df.columns:
                df[col] = pd.NA
                migrated = True
        df = df[COLUMNS]
        if migrated:
            save_data(df)
        return df
    return pd.DataFrame(columns=COLUMNS)


def save_data(df):
    """Save purchase data to CSV."""
    df.to_csv(DATA_FILE, index=False)


# --- Page Config ---
st.set_page_config(page_title="GIX Purchase Tracker", page_icon="🛒", layout="wide")

st.title("🛒 GIX Purchase Tracker")
st.caption("Submit purchase requests as a student, or review and export them as the program coordinator.")

# --- Sidebar Navigation ---
page = st.sidebar.radio("Navigate", ["📝 Submit a Request", "📊 Review Dashboard"])

# ============================================================
# PAGE 1: Student submission
# ============================================================
if page == "📝 Submit a Request":
    st.header("Submit a purchase request")
    st.caption(
        "Line total = unit price × quantity. Include a purchase link and any notes for the coordinator."
    )

    purchase_kind = st.radio(
        "Provider / supplier",
        ["Amazon", "Other"],
        horizontal=True,
        help="Choose Amazon or describe another supplier below.",
    )

    team_number = st.text_input("Team #", placeholder="e.g., 3 or Team 3", key="sf_team")
    cfo_name = st.text_input("CFO name", placeholder="Your team's CFO", key="sf_cfo")

    if purchase_kind == "Other":
        supplier_name = st.text_input(
            "Supplier name", placeholder="e.g., Adafruit, Digi-Key", key="sf_supplier"
        )
    else:
        supplier_name = "Amazon"

    item_name = st.text_input("Item name", placeholder="e.g., ESP32-S3 Dev Board", key="sf_item")

    q_col, p_col = st.columns(2)
    with q_col:
        quantity = st.number_input("Quantity", min_value=1, value=1, step=1, key="sf_qty")
    with p_col:
        unit_price = st.number_input(
            "Unit price ($)",
            min_value=0.0,
            value=0.0,
            step=0.01,
            format="%.2f",
            key="sf_unit",
        )

    line_total = round(quantity * unit_price, 2)
    st.markdown(f"**Line total:** ${line_total:,.2f} *(unit price × quantity)*")

    link = st.text_input(
        "Purchase link",
        placeholder="https://...",
        key="sf_link",
    )
    notes = st.text_area(
        "Notes",
        placeholder="Optional context for the coordinator (shipping, alternatives, etc.).",
        key="sf_notes",
    )

    submitted = st.button("Submit request", type="primary", use_container_width=True)

    if submitted:
        errors = []
        if not team_number.strip():
            errors.append("Enter your team #.")
        if not cfo_name.strip():
            errors.append("Enter the CFO name.")
        if purchase_kind == "Other" and not (supplier_name or "").strip():
            errors.append("Enter the supplier name.")
        if not item_name.strip():
            errors.append("Enter the item name.")
        if unit_price <= 0:
            errors.append("Enter a valid unit price.")
        if not link.strip():
            errors.append("Enter the purchase link.")

        if errors:
            for e in errors:
                st.error(e)
        else:
            final_supplier = "Amazon" if purchase_kind == "Amazon" else supplier_name.strip()
            new_row = pd.DataFrame(
                [
                    {
                        "Request ID": str(uuid.uuid4()),
                        "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
                        "Team #": team_number.strip(),
                        "CFO Name": cfo_name.strip(),
                        "Provider/Supplier": final_supplier,
                        "Item Name": item_name.strip(),
                        "Quantity": int(quantity),
                        "Unit Price ($)": unit_price,
                        "Total Price ($)": line_total,
                        "Link to Purchase": link.strip(),
                        "Notes": notes.strip(),
                        "Approval Status": "Pending",
                    }
                ]
            )
            df = load_data()
            df = pd.concat([df, new_row], ignore_index=True)
            save_data(df)
            st.success(
                f"Submitted: **{item_name.strip()}** × {quantity} — **${line_total:,.2f}** total."
            )

# ============================================================
# PAGE 2: Coordinator review
# ============================================================
elif page == "📊 Review Dashboard":
    st.header("Review dashboard")
    st.caption(
        "Filter requests, edit **Approval Status** in the table, then save. Export the full dataset or the current filter to CSV."
    )

    df = load_data()

    if df.empty:
        st.warning("No purchase requests yet. Students can submit from **📝 Submit a Request**.")
    else:
        st.subheader("Filters")
        filter_col1, filter_col2, filter_col3 = st.columns(3)

        with filter_col1:
            teams = ["All"] + sorted(df["Team #"].dropna().astype(str).unique().tolist(), key=str)
            selected_team = st.selectbox("Team", teams, key="f_team")

        with filter_col2:
            suppliers = ["All"] + sorted(
                df["Provider/Supplier"].dropna().astype(str).unique().tolist(), key=str
            )
            selected_supplier = st.selectbox("Supplier", suppliers, key="f_supplier")

        with filter_col3:
            statuses = ["All"] + STATUS_OPTIONS
            selected_status = st.selectbox("Approval status", statuses, key="f_status")

        filtered = df.copy()
        if selected_team != "All":
            filtered = filtered[filtered["Team #"].astype(str) == selected_team]
        if selected_supplier != "All":
            filtered = filtered[filtered["Provider/Supplier"].astype(str) == selected_supplier]
        if selected_status != "All":
            filtered = filtered[filtered["Approval Status"].astype(str) == selected_status]

        st.subheader("Summary")
        n = len(filtered)
        total_dollars = float(filtered["Total Price ($)"].sum()) if n else 0.0
        t1, t2 = st.columns(2)
        t1.metric("Rows (this view)", n)
        t2.metric("Total $ (this view)", f"${total_dollars:,.2f}")

        if filtered.empty:
            st.info("No requests match the current filters. Adjust filters above or export all rows below.")
        else:
            st.subheader("Requests")
            # data_editor + LinkColumn can throw JS `includes is not a function` if cells are
            # NaN or non-strings (typical after CSV load). Use plain TextColumn for URLs and
            # coerce string columns before rendering.
            edit_df = filtered.copy()
            for col in (
                "Request ID",
                "Timestamp",
                "Team #",
                "CFO Name",
                "Provider/Supplier",
                "Item Name",
                "Link to Purchase",
                "Notes",
                "Approval Status",
            ):
                if col in edit_df.columns:
                    edit_df[col] = edit_df[col].fillna("").map(lambda x: "" if pd.isna(x) else str(x))

            disabled_cols = [c for c in edit_df.columns if c != "Approval Status"]
            edited = st.data_editor(
                edit_df,
                use_container_width=True,
                hide_index=True,
                disabled=disabled_cols,
                column_config={
                    "Link to Purchase": st.column_config.TextColumn("Purchase link"),
                    "Unit Price ($)": st.column_config.NumberColumn(format="$%.2f"),
                    "Total Price ($)": st.column_config.NumberColumn(format="$%.2f"),
                    "Approval Status": st.column_config.TextColumn(
                        "Approval Status",
                    ),
                },
                key="review_editor",
            )

            if st.button("Save status changes", type="primary"):
                full = load_data()
                id_to_status = dict(
                    zip(edited["Request ID"].astype(str), edited["Approval Status"].astype(str))
                )
                for rid, status in id_to_status.items():
                    full.loc[full["Request ID"].astype(str) == rid, "Approval Status"] = status
                save_data(full)
                st.success("Approval statuses saved.")
                st.rerun()

        st.subheader("Export CSV")
        exp1, exp2 = st.columns(2)
        with exp1:
            full_csv = load_data().to_csv(index=False).encode("utf-8")
            st.download_button(
                "Download all requests",
                data=full_csv,
                file_name=f"gix_purchases_all_{datetime.now().strftime('%Y%m%d')}.csv",
                mime="text/csv",
                use_container_width=True,
            )
        with exp2:
            view_csv = filtered.to_csv(index=False).encode("utf-8")
            st.download_button(
                "Download this view only",
                data=view_csv,
                file_name=f"gix_purchases_filtered_{datetime.now().strftime('%Y%m%d')}.csv",
                mime="text/csv",
                use_container_width=True,
            )
