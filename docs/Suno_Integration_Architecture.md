# Suno Integration Architecture Plan

**Date:** 2026-05
**Context:** The Audiopheliac project requires integration with Suno AI (v5.5) for music generation. Currently, Suno does not offer an official, public-facing REST API for Premier users. 

This document outlines the architectural paths available for integration, balancing automation potential with security and Terms of Service (ToS) compliance.

## Path 1: Agentic Automation via MCP (Model Context Protocol)
This is the recommended path for seamless CLI integration with Claude (Rafa), allowing the agent to generate and manage songs directly.

*   **Technology:** `mcp-suno` (available on PyPI) or `AceDataCloud/SunoMCP`.
*   **Mechanism:** These are MCP wrappers that bridge Claude with unofficial Suno API gateways (like AceDataCloud). 
*   **Requirements:** Requires a paid API token from a third-party gateway (e.g., `ACEDATACLOUD_API_TOKEN`). 
*   **Implementation Steps:**
    1. Procure the third-party API key.
    2. Add the key to `C:\Users\gillo\The-Audiopheliac\config\suno.env` (ensuring it is gitignored).
    3. Update `C:\Users\gillo\.claude\mcp.json` to include the server:
       ```json
       "suno": {
         "command": "uvx",
         "args": ["mcp-suno"],
         "env": {
           "ACEDATACLOUD_API_TOKEN": "<YOUR_TOKEN>"
         }
       }
       ```
*   **Status:** Pending API key procurement. Not implemented to prevent logging/exposing missing secrets.

## Path 2: Local Prompt Engineering Pipeline (Straightforward & Immediate)
Given the lack of an official API, the most immediate and secure integration is to build tooling that assists with the Suno web UI workflow. 

*   **Technology:** Python CLI script.
*   **Mechanism:** A local script (`automation/suno_prompt_generator.py`) that uses the Audiopheliac "Listening Profile" to generate optimized style descriptors, genre tags, and lyric scaffolding.
*   **Requirements:** None. Uses standard Python.
*   **Implementation:** 
    *   Created `Suno/Profile_Drafts.md` fulfilling open action items (Bio, Taste Profile).
    *   Created `automation/suno_prompt_generator.py` to standardize prompt generation based on the brand's sonic priorities (bass-conscious, clear vocals, muscular drums).
*   **Status:** Implemented. 

## Next Steps
1. Review and apply the drafts in `Suno/Profile_Drafts.md` to the Suno account.
2. Use `python automation/suno_prompt_generator.py` to begin structuring the "first album project".
3. Evaluate whether the cost and ToS risks of a third-party API gateway (Path 1) are acceptable for full MCP automation.
