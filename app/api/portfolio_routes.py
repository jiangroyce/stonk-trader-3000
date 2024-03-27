from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import Portfolio, Order
import pandas as pd

portfolio_routes = Blueprint('portfolios', __name__)

@portfolio_routes.route("/current")
@login_required
def portfolio():
    """
    Get all positions in current user's portfolio
    """
    portfolio = Portfolio.query.get(current_user.id)
    data = []
    for order in portfolio.orders:
        data.append((order.stock_ticker, order.stock.name, order.stock.price, order.cost_basis, order.quantity))
    data = pd.DataFrame(data, columns=["ticker", "name", "price", "cost_basis", "quantity"])
    response = []
    cost = 0
    for ticker, group in data.groupby("ticker"):
        group["cost"] = group["cost_basis"] * group["quantity"]
        if group["quantity"].sum() == 0:
            portfolio.cash -= group["cost"].sum()
            continue
        avg_cost = group["cost"].sum() / group["quantity"].sum()
        cost += group["cost"].sum()
        response.append((ticker, group.name.iloc[0], group.price.iloc[0], avg_cost, group.quantity.sum()))
    response.append(("-", "Cash", portfolio.cash, 1, 1))
    cost += portfolio.cash
    response = pd.DataFrame(response, columns=["ticker", "name", "price", "cost_basis", "quantity"])
    response["value"] = response["price"] * response["quantity"]
    response["GL$"] = (response["price"] - response["cost_basis"]) * response["quantity"]
    response["GL%"] = response["price"]/response["cost_basis"] - 1
    response["portfolio_weight"] = response["value"]/response["value"].sum()
    response.loc[response.name == "Cash", "GL$"] = 0
    response.loc[response.name == "Cash", "GL%"] = 0
    sums = response.sum(numeric_only=True)
    totals = ("-", "Total", 0, 0, 0, sums.value, sums["GL$"], sums.value/cost-1, sums.portfolio_weight)
    totals = pd.DataFrame([totals], columns=response.columns)
    final = pd.concat([response, totals])
    return final.to_json(orient="records")