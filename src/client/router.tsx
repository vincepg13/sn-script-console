import Layout from "./layout/Layout";
import ListPage from "./routes/ListPage";
import HomePage from "./routes/HomePage";
import FormPage from "./routes/FormPage";
import ScriptPage from "./routes/ScriptPage";
import { createHashRouter } from "react-router";
import GeneralError from "./routes/errors/GeneralError";
import WidgetEditorPage from "./routes/WidgetEditorPage";
import NotFoundError from "./routes/errors/NotFoundError";
import WidgetEditorIndex from "./routes/WidgetEditorIndex";
import InvalidRecordError from "./routes/errors/InvalidError";

export function makeRouter() {
  return createHashRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <GeneralError />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "list/:table", element: <ListPage /> },
        { path: "widget_editor", element: <WidgetEditorIndex /> },
        { path: "widget_editor/:id", element: <WidgetEditorPage /> },
        { path: "form/:table/:sys_id", element: <FormPage /> },
        { path: "script/:table/:id", element: <ScriptPage /> },
        { path: "invalid", element: <InvalidRecordError /> },
        { path: "*", element: <NotFoundError /> },
      ],
    },
  ]);
}
