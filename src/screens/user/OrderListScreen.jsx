import { useEffect, useState } from "react";
import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../../styles/user";
import UserMenu from "../../components/user/UserMenu";
import Title from "../../components/common/Title";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import OrderItemList from "../../components/user/OrderItemList";
import { getOrders } from "../../services/apiService";

const OrderListScreenWrapper = styled.div`
  .order-tabs-contents {
    margin-top: 40px;
  }

  .order-tabs-content.hidden {
    display: none;
  }

  .order-tabs-head {
    min-width: 170px;
    padding: 12px 0;
    border-bottom: 3px solid ${defaultTheme.color_whitesmoke};

    &.order-tabs-head-active {
      border-bottom-color: ${defaultTheme.color_outerspace};
    }

    @media (max-width: ${breakpoints.lg}) {
      min-width: 120px;
    }

    @media (max-width: ${breakpoints.xs}) {
      min-width: 80px;
    }
  }
`;

const StatusBadge = styled.span`
  background-color: #dc3545;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  margin-left: 8px;
  height: 20px;
  width: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Đơn hàng", link: "/order" },
];

const OrderListScreen = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderCounts, setOrderCounts] = useState({
    pending: 0,
    shipping: 0,
    completed: 0,
    cancelled: 0,
    refund: 0,
  });

  useEffect(() => {
    // Gọi API để lấy danh sách đơn hàng
    const fetchOrders = async () => {
      try {
        const data = await getOrders(1, 10); // page 1, pageSize 10
        if (data?.code === 20001) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const activeOrders = orders?.filter((order) => order.status === "pending");
  const shippingOrders = orders?.filter((order) => order.status === "shipping");
  const completedOrders = orders?.filter((order) => order.status === "success");
  const cancelledOrders = orders?.filter((order) => order.status === "cancel");
  const refundOrders = orders?.filter((order) => order.status === "refund");

  const formatBadgeCount = (count) => {
    return count > 99 ? "99+" : count;
  };

  useEffect(() => {
    // Calculate counts from orders array
    const counts = orders?.reduce(
      (acc, order) => {
        switch (order.status) {
          case "pending":
            acc.pending++;
            break;
          case "shipping":
            acc.shipping++;
            break;
          case "completed":
            acc.completed++;
            break;
          case "cancelled":
            acc.cancelled++;
            break;
          case "refund":
            acc.refund++;
            break;
          default:
            break;
        }
        return acc;
      },
      { pending: 0, shipping: 0, completed: 0, cancelled: 0, refund: 0 }
    );

    setOrderCounts(counts);
  }, [orders]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <OrderListScreenWrapper className="page-py-spacing">
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <UserDashboardWrapper>
          <UserMenu />
          <UserContent>
            <Title titleText={"Đơn hàng"} />
            <div className="order-tabs">
              <div className="order-tabs-heads">
                <button
                  type="button"
                  className={`order-tabs-head text-xl italic ${
                    activeTab === "active" ? "order-tabs-head-active" : ""
                  }`}
                  onClick={() => handleTabClick("active")}
                >
                  Đang xử lý{" "}
                  <StatusBadge>
                    {formatBadgeCount(orderCounts?.pending || 0)}
                  </StatusBadge>
                </button>
                <button
                  type="button"
                  className={`order-tabs-head text-xl italic ${
                    activeTab === "shipping" ? "order-tabs-head-active" : ""
                  }`}
                  onClick={() => handleTabClick("shipping")}
                >
                  Đang vận chuyển{" "}
                  <StatusBadge>
                    {formatBadgeCount(orderCounts?.shipping || 0)}
                  </StatusBadge>
                </button>
                <button
                  type="button"
                  className={`order-tabs-head text-xl italic ${
                    activeTab === "completed" ? "order-tabs-head-active" : ""
                  }`}
                  onClick={() => handleTabClick("completed")}
                >
                  Đã giao hàng{" "}
                  <StatusBadge>
                    {formatBadgeCount(orderCounts?.completed || 0)}
                  </StatusBadge>
                </button>
                <button
                  type="button"
                  className={`order-tabs-head text-xl italic ${
                    activeTab === "cancelled" ? "order-tabs-head-active" : ""
                  }`}
                  onClick={() => handleTabClick("cancelled")}
                >
                  Đã huỷ
                  <StatusBadge>
                    {formatBadgeCount(orderCounts?.cancelled || 0)}
                  </StatusBadge>
                </button>
                <button
                  type="button"
                  className={`order-tabs-head text-xl italic ${
                    activeTab === "refund" ? "order-tabs-head-active" : ""
                  }`}
                  onClick={() => handleTabClick("refund")}
                >
                  Đã hoàn tiền{" "}
                  <StatusBadge>
                    {formatBadgeCount(orderCounts?.refund || 0)}
                  </StatusBadge>
                </button>
              </div>

              <div className="order-tabs-contents">
                {loading ? (
                  <p>Đang tải...</p>
                ) : (
                  <>
                    <div
                      className={`order-tabs-content ${
                        activeTab === "active" ? "" : "hidden"
                      }`}
                      id="active"
                    >
                      {activeOrders?.length > 0 ? (
                        <OrderItemList orders={activeOrders} />
                      ) : (
                        <p>Không có đơn hàng đang xử lý.</p>
                      )}
                    </div>

                    <div
                      className={`order-tabs-content ${
                        activeTab === "shipping" ? "" : "hidden"
                      }`}
                      id="shipping"
                    >
                      {shippingOrders?.length > 0 ? (
                        <OrderItemList orders={shippingOrders} />
                      ) : (
                        <p>Không có đơn hàng đang vận chuyển.</p>
                      )}
                    </div>

                    <div
                      className={`order-tabs-content ${
                        activeTab === "completed" ? "" : "hidden"
                      }`}
                      id="completed"
                    >
                      {completedOrders?.length > 0 ? (
                        <OrderItemList orders={completedOrders} />
                      ) : (
                        <p>Không có đơn hàng nào đã giao.</p>
                      )}
                    </div>

                    <div
                      className={`order-tabs-content ${
                        activeTab === "cancelled" ? "" : "hidden"
                      }`}
                      id="cancelled"
                    >
                      {cancelledOrders?.length > 0 ? (
                        <OrderItemList orders={cancelledOrders} />
                      ) : (
                        <p>Không có đơn hàng đã huỷ.</p>
                      )}
                    </div>

                    <div
                      className={`order-tabs-content ${
                        activeTab === "refund" ? "" : "hidden"
                      }`}
                      id="refund"
                    >
                      {refundOrders?.length > 0 ? (
                        <OrderItemList orders={refundOrders} />
                      ) : (
                        <p>Không có đơn hàng đã hoàn tiền.</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </UserContent>
        </UserDashboardWrapper>
      </Container>
    </OrderListScreenWrapper>
  );
};

export default OrderListScreen;
