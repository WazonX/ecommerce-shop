import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce",
});

export const createResponse = (data: any, status: number = 200) => {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const createErrorResponse = (error: string, status: number = 500) => {
  return createResponse({ error }, status);
}; 