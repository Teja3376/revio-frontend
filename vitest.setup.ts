import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

// Pages load sample data asynchronously; the full suite runs many files at once.
configure({ asyncUtilTimeout: 5000 });
