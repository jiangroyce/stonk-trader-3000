"""empty message

Revision ID: f6406d3f9f36
Revises: ecd8f202ccaf
Create Date: 2024-04-04 15:44:54.159278

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f6406d3f9f36'
down_revision = 'ecd8f202ccaf'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('screeners',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('_params', sa.JSON(), nullable=False),
    sa.Column('price', sa.String(), nullable=True),
    sa.Column('market_cap', sa.String(), nullable=True),
    sa.Column('shares_outstanding', sa.String(), nullable=True),
    sa.Column('past_year_return', sa.String(), nullable=True),
    sa.Column('past_outperformance', sa.String(), nullable=True),
    sa.Column('trailing_pe', sa.String(), nullable=True),
    sa.Column('forward_pe', sa.String(), nullable=True),
    sa.Column('pb', sa.String(), nullable=True),
    sa.Column('dividend_yield', sa.String(), nullable=True),
    sa.Column('recommendation', sa.String(), nullable=True),
    sa.Column('target_mean', sa.String(), nullable=True),
    sa.Column('short_interest', sa.String(), nullable=True),
    sa.Column('fifty_two_high', sa.String(), nullable=True),
    sa.Column('distance_to_52_high', sa.String(), nullable=True),
    sa.Column('fifty_two_low', sa.String(), nullable=True),
    sa.Column('distance_to_52_low', sa.String(), nullable=True),
    sa.Column('industry', sa.String(), nullable=True),
    sa.Column('sector', sa.String(), nullable=True),
    sa.Column('past_day_return', sa.String(), nullable=True),
    sa.Column('past_month_return', sa.String(), nullable=True),
    sa.Column('avg_volume', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('strategies',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('stock_ticker', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('quantity', sa.Float(), nullable=False),
    sa.Column('frequency', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['stock_ticker'], ['stocks.ticker'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('watchlists',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('stock_ticker', sa.String(), nullable=True),
    sa.Column('market_id', sa.Integer(), nullable=True),
    sa.Column('list_number', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['stock_ticker'], ['stocks.ticker'], ),
    sa.ForeignKeyConstraint(['market_id'], ['markets.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id', 'list_number', 'stock_ticker')
    )
    op.create_table('orders',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('portfolio_id', sa.Integer(), nullable=False),
    sa.Column('stock_ticker', sa.String(), nullable=False),
    sa.Column('order_number', sa.Integer(), nullable=True),
    sa.Column('cost_basis', sa.Float(), nullable=True),
    sa.Column('quantity', sa.Float(), nullable=True),
    sa.Column('createdAt', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['portfolio_id'], ['portfolios.id'], ),
    sa.ForeignKeyConstraint(['stock_ticker'], ['stocks.ticker'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('orders')
    op.drop_table('watchlists')
    op.drop_table('strategies')
    op.drop_table('screeners')
    # ### end Alembic commands ###
