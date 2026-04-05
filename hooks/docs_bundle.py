"""
MkDocs hook: generates docs-bundle.js in site/javascripts/
containing all page markdown content for the download-all feature.
"""

import json
import os

_all_docs = {}


def on_page_markdown(markdown, page, config, files, **kwargs):
    """Collect each page's markdown as it's processed."""
    _all_docs[page.file.src_path] = {
        "title": page.title or page.file.src_path,
        "filename": page.file.src_path,
        "content": markdown,
    }
    return markdown


def on_post_build(config, **kwargs):
    """Write all collected markdown to a JS bundle."""
    js_content = "window.DANDORI_DOCS = " + json.dumps(_all_docs, ensure_ascii=False) + ";\n"

    output_path = os.path.join(config["site_dir"], "javascripts", "docs-bundle.js")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)
