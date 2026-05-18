"use client";

/**
 * Re-exports PageRenderer as HtmlPageWrapper for backward compatibility.
 * New templates should use PageRenderer directly with Block[] input.
 */
export { PageRenderer as HtmlPageWrapper } from "./page-renderer";
