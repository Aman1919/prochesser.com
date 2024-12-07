/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { format } from "date-fns";
import { Transaction } from "../schema";
import { BACKEND_URL } from "../../../constants/routes";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const TransactionsList: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all"); // State for status filter
  const [filterType, setFilterType] = useState<string>("all"); // State for type filter
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async () => {
    //fetch transactions, games,reports, users,etc
    const queryParams = new URLSearchParams({
      type: filterType,
      status: filterStatus,
      search,
    }).toString();
    const url = `${BACKEND_URL}/admin/transactions/${page}?${queryParams}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 400) {
        throw new Error(`Error fetching transactions.`);
      } else if (response.status >= 500) {
        throw new Error("Internal server error. Please try again later.");
      }

      const data = await response.json();
      console.log(`transactions fetched:`, data);
      setTransactions(() => {
        const allTransactions = [...(data?.transactions ?? [])];
        // const allTransactions = [...(prevTransactions ?? []), ...data];

        const uniqueTransactions = allTransactions.filter(
          (transaction, index, self) =>
            index === self.findIndex((t) => t.id === transaction.id)
        );

        return uniqueTransactions;
      });
      setHasMore(data.totalCount !== data.transactions.length);
      return data;
    } catch (error) {
      console.error("Error:", error);
      alert(`Error fetching transactions`);
    }
  };

  const [page, setPage] = useState(1);
  const { isLoading: isLoadingMore, refetch } = useQuery<Transaction[]>({
    queryKey: ["TransactionHistory", filterStatus, filterType, page],
    queryFn: fetchTransactions,
  });

  // Function to handle filtering logic based on status and type
  const filteredTransactions = transactions?.filter((transaction) => {
    const statusMatch =
      filterStatus === "all" ||
      transaction.status.toLowerCase() === filterStatus;
    const typeMatch =
      filterType === "all" || transaction.type.toLowerCase() === filterType;
    return statusMatch && typeMatch;
  });
  const [hasMore, setHasMore] = useState(true); // To track if more games exist

  const LoadMoreTransactions = async () => {
    setPage(page + 1);
  };

  const refetchTransactions = async () => {
    refetch();
  };

  return (
    <div>
      <div className="flex justify-between gap-2">
        <div className="flex justify-center gap-2">
          <div className="mb-4">
            <label
              htmlFor="statusFilter"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="requested">Requested</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="statusFilter"
              className="block mb-2 text-sm font-medium text-black pointer-events-none"
            >
              Filter by Status:
            </label>
            <div className="flex justify-center items-center">
              <input
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
              />
              <div>
                <button
                  className="text-black ml-3 hover:bg-slate-800 hover:text-white bg-slate-200 p-2 transition-all"
                  onClick={refetchTransactions}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Type Filter Dropdown */}
        <div className="mb-4">
          <label
            htmlFor="typeFilter"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Filter by Type:
          </label>
          <select
            id="typeFilter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions && filteredTransactions?.length > 0 ? (
          <ul className="space-y-4">
            {transactions &&
              filteredTransactions.map((transaction) => (
                <TransactionsComponent transaction={transaction} />
              ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            No transactions found for the selected filters.
          </p>
        )}
      </div>
      {isLoadingMore && (
        <p className="text-white text-xl m-3">Loading more transactions...</p>
      )}

      {hasMore && !isLoadingMore && (
        <button
          onClick={LoadMoreTransactions}
          className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded"
        >
          Load More
        </button>
      )}
    </div>
  );
};

type TransactionsProps = {
  transaction: any;
};
const TransactionsComponent = ({ transaction }: TransactionsProps) => {
  function onViewProfile(id: string): void {
    window.location.href = `/player/${id}`;
  }

  async function approve() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/v2/payments/crypto/withdraw/success`,
        {
          txId: transaction.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the token is passed
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  async function reject() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/v2/payments/crypto/withdraw/failure`,
        {
          txId: transaction.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the token is passed
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  return (
    <li
      key={transaction.id}
      className={`p-4 rounded-lg shadow-lg transition ${
        transaction.status === "completed"
          ? "bg-green-50 border border-green-300"
          : "bg-gray-50 border border-gray-300"
      }`}
    >
      <div className="flex justify-between gap-6">
        <div>
          <p className="font-semibold text-gray-800">
            Amount:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency:
                transaction?.mode === "crypto" ? "USD" : transaction?.currency,
            }).format(transaction?.amount)}
          </p>
          <p className="font-semibold text-gray-800">
            Platform Fees:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency:
                transaction?.mode === "crypto" ? "USD" : transaction?.currency,
            }).format(transaction?.platform_charges)}
          </p>
          <p className="font-semibold text-gray-800">
            Final Amount in USD:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(transaction?.finalamountInUSD)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Status: {transaction?.status}
          </p>
          <p className="text-sm text-gray-500">Type: {transaction?.type}</p>
          <p className="text-sm text-gray-500">Mode: {transaction?.mode}</p>
        </div>
        <div className="w-5/12">
          <p className="text-sm text-gray-500">
            {format(new Date(transaction.createdAt), "PPpp")}
          </p>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">
              User: {transaction.user.name}
            </p>
            <p className="text-sm text-gray-500">
              Email: {transaction.user.email}
            </p>
            <p className="text-sm text-gray-500">
              Wallet Address/Phone/Email: {transaction?.wallet_address}
            </p>
          </div>
          {transaction.type === "WITHDRAWAL" && (
            <div className="flex mt-4 gap-4">
              <button
                onClick={approve}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
              >
                Approve
              </button>
              <button
                onClick={reject}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
      <p
        className="mt-4 font-semibold text-blue-600 cursor-pointer hover:underline"
        onClick={() => onViewProfile(transaction.user.id)}
      >
        View User
      </p>
    </li>
  );
};
