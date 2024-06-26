from app.models import db, Portfolio, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo Portfolio, you can add other Portfolios here if you want
def seed_portfolios():
    demo = Portfolio(
        user_id=1, cash=0, order_number=4)
    marnie = Portfolio(
        user_id=2, cash=0, order_number=7)
    bobbie = Portfolio(
        user_id=3, cash=0, order_number=4)

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the portfolios table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_portfolios():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolios RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolios"))

    db.session.commit()
