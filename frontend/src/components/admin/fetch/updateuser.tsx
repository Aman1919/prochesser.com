import { BACKEND_URL } from "../../../constants/routes";

export default async function updateUser(
  type: string,
  id: string,
  a: number = 0
) {
  const url = `${BACKEND_URL}/admin/users/${id}/${type}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ amount: a }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update the ${type}`);
    }

    const data = await response.json();
    alert(data.message);
    console.log(`Update the ${type}`, data);
  } catch (error) {
    console.error(`Error updating the ${type}`, error);
  }
}

export async function updateUserRole(role: string, id: string) {
  const a = role.toLowerCase() === "user" ? "moderatorrole" : "userrole";
  const url = `${BACKEND_URL}/admin/users/${id}/${a}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to update the role`);
    }

    const data = await response.json();
    alert(data.message);
    console.log(`Update the role`, data);
  } catch (error) {
    console.error(`Error updating the role`, error);
  }
}
