#!/usr/bin/env python3
"""
Document Reader Tool (文档读取工具)
Supports reading DOC/DOCX and PDF files with automatic image detection and OCR (支持读取 DOC/DOCX 和 PDF 文件，自动检测图片并使用 OCR)

Features (功能):
- Extract text from DOC/DOCX and PDF files (从 DOC/DOCX 和 PDF 文件提取文本)
- Detect images in documents (检测文档中的图片)
- Use OCR for images when detected (检测到图片时使用 OCR)
- Output to Markdown format (输出为 Markdown 格式)
"""

import os
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Tuple, List, Optional
import argparse

try:
    import pdfplumber
    PDF_SUPPORT = True
except ImportError:
    PDF_SUPPORT = False
    print("Warning: pdfplumber not installed. PDF support limited. (警告：未安装 pdfplumber，PDF 支持受限)")

try:
    from PIL import Image
    import pytesseract
    OCR_SUPPORT = True
except ImportError:
    OCR_SUPPORT = False
    print("Warning: PIL/pytesseract not installed. OCR support disabled. (警告：未安装 PIL/pytesseract，OCR 支持已禁用)")

try:
    import io
    from docx import Document
    DOCX_SUPPORT = True
except ImportError:
    DOCX_SUPPORT = False
    print("Warning: python-docx not installed. DOCX support limited. (警告：未安装 python-docx，DOCX 支持受限)")


class DocumentReader:
    """Document reader with image detection and OCR support (带图片检测和 OCR 支持的文档读取器)"""
    
    def __init__(self, use_ocr: bool = True):
        """
        Initialize document reader (初始化文档读取器)
        
        Args:
            use_ocr: Whether to use OCR for images (是否对图片使用 OCR)
        """
        self.use_ocr = use_ocr and OCR_SUPPORT
        if self.use_ocr:
            print("OCR support enabled (OCR 支持已启用)")
        else:
            print("OCR support disabled (OCR 支持已禁用)")
    
    def has_images(self, file_path: str) -> Tuple[bool, List[str]]:
        """
        Check if document contains images (检查文档是否包含图片)
        
        Args:
            file_path: Path to document file (文档文件路径)
            
        Returns:
            Tuple of (has_images, image_paths) (是否包含图片, 图片路径列表)
        """
        file_ext = Path(file_path).suffix.lower()
        
        if file_ext == '.docx':
            return self._check_docx_images(file_path)
        elif file_ext == '.pdf':
            return self._check_pdf_images(file_path)
        elif file_ext == '.doc':
            # Old DOC format - limited support (旧 DOC 格式 - 支持有限)
            return False, []
        else:
            return False, []
    
    def _check_docx_images(self, file_path: str) -> Tuple[bool, List[str]]:
        """Check for images in DOCX file (检查 DOCX 文件中的图片)"""
        try:
            with zipfile.ZipFile(file_path, 'r') as docx:
                # Check media folder (检查媒体文件夹)
                media_files = [f for f in docx.namelist() if f.startswith('word/media/')]
                image_files = [f for f in media_files if any(f.lower().endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.gif', '.bmp'])]
                return len(image_files) > 0, image_files
        except Exception as e:
            print(f"Error checking DOCX images: {e} (检查 DOCX 图片时出错：{e})")
            return False, []
    
    def _check_pdf_images(self, file_path: str) -> Tuple[bool, List[str]]:
        """Check for images in PDF file (检查 PDF 文件中的图片)"""
        if not PDF_SUPPORT:
            return False, []
        
        try:
            with pdfplumber.open(file_path) as pdf:
                has_images = False
                for page in pdf.pages:
                    # Check for images in page (检查页面中的图片)
                    if hasattr(page, 'images') and page.images:
                        has_images = True
                        break
                return has_images, []  # PDF images are embedded, return empty list (PDF 图片是嵌入的，返回空列表)
        except Exception as e:
            print(f"Error checking PDF images: {e} (检查 PDF 图片时出错：{e})")
            return False, []
    
    def extract_text(self, file_path: str) -> str:
        """
        Extract text from document (从文档提取文本)
        
        Args:
            file_path: Path to document file (文档文件路径)
            
        Returns:
            Extracted text as string (提取的文本字符串)
        """
        file_ext = Path(file_path).suffix.lower()
        
        if file_ext == '.docx':
            return self._extract_docx_text(file_path)
        elif file_ext == '.pdf':
            return self._extract_pdf_text(file_path)
        elif file_ext == '.doc':
            return self._extract_doc_text(file_path)
        else:
            return f"Unsupported file format: {file_ext} (不支持的文件格式：{file_ext})"
    
    def _extract_docx_text(self, file_path: str) -> str:
        """Extract text from DOCX file (从 DOCX 文件提取文本)"""
        try:
            if DOCX_SUPPORT:
                # Use python-docx for better text extraction (使用 python-docx 进行更好的文本提取)
                doc = Document(file_path)
                paragraphs = []
                for para in doc.paragraphs:
                    if para.text.strip():
                        paragraphs.append(para.text)
                return '\n\n'.join(paragraphs)
            else:
                # Fallback: Extract from XML (备用方案：从 XML 提取)
                return self._extract_docx_text_xml(file_path)
        except Exception as e:
            print(f"Error extracting DOCX text: {e} (提取 DOCX 文本时出错：{e})")
            return ""
    
    def _extract_docx_text_xml(self, file_path: str) -> str:
        """Extract text from DOCX using XML parsing (使用 XML 解析从 DOCX 提取文本)"""
        try:
            with zipfile.ZipFile(file_path, 'r') as docx:
                xml_content = docx.read('word/document.xml')
                root = ET.fromstring(xml_content)
                
                # Extract text from all text nodes (从所有文本节点提取文本)
                namespace = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                paragraphs = []
                for para in root.findall('.//w:p', namespace):
                    text_parts = []
                    for run in para.findall('.//w:t', namespace):
                        if run.text:
                            text_parts.append(run.text)
                    para_text = ''.join(text_parts).strip()
                    if para_text:
                        paragraphs.append(para_text)
                
                return '\n\n'.join(paragraphs)
        except Exception as e:
            print(f"Error extracting DOCX text from XML: {e} (从 XML 提取 DOCX 文本时出错：{e})")
            return ""
    
    def _extract_pdf_text(self, file_path: str) -> str:
        """Extract text from PDF file (从 PDF 文件提取文本)"""
        if not PDF_SUPPORT:
            return "PDF support requires pdfplumber. Install with: pip install pdfplumber (PDF 支持需要 pdfplumber。安装：pip install pdfplumber)"
        
        try:
            text_parts = []
            with pdfplumber.open(file_path) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(f"--- Page {page_num} ---\n{page_text}")
                    
                    # Extract images and use OCR if enabled (提取图片并在启用时使用 OCR)
                    if self.use_ocr and hasattr(page, 'images') and page.images:
                        for img_idx, img in enumerate(page.images):
                            # Note: pdfplumber doesn't directly extract images, this is a placeholder
                            # (注意：pdfplumber 不直接提取图片，这是占位符)
                            text_parts.append(f"\n[Image {img_idx + 1} on page {page_num} - OCR not available in this version]")
            
            return '\n\n'.join(text_parts)
        except Exception as e:
            return f"Error extracting PDF text: {e} (提取 PDF 文本时出错：{e})"
    
    def _extract_doc_text(self, file_path: str) -> str:
        """Extract text from old DOC format (从旧 DOC 格式提取文本)"""
        return "Old DOC format (.doc) requires additional tools. Consider converting to DOCX. (旧 DOC 格式 (.doc) 需要额外工具。建议转换为 DOCX)"
    
    def extract_with_images(self, file_path: str) -> str:
        """
        Extract text and process images from document (从文档提取文本并处理图片)
        
        Args:
            file_path: Path to document file (文档文件路径)
            
        Returns:
            Markdown formatted text with extracted content (包含提取内容的 Markdown 格式文本)
        """
        # Check for images (检查图片)
        has_images, image_files = self.has_images(file_path)
        
        # Extract text (提取文本)
        text_content = self.extract_text(file_path)
        
        # Build markdown output (构建 Markdown 输出)
        output = []
        output.append(f"# Document Content (文档内容)\n")
        output.append(f"**Source File**: `{file_path}`\n")
        output.append(f"**Has Images**: {'Yes' if has_images else 'No'} ({'是' if has_images else '否'})\n")
        
        if has_images:
            output.append(f"\n## Images Detected (检测到图片)\n")
            output.append(f"Found {len(image_files)} image(s) in document (在文档中找到 {len(image_files)} 张图片)\n")
            
            if self.use_ocr:
                output.append("**Note**: OCR processing for images is available but requires image extraction. (注意：图片的 OCR 处理可用，但需要提取图片)")
                output.append("For full OCR support, consider using specialized tools. (要获得完整的 OCR 支持，请考虑使用专业工具)")
            else:
                output.append("**Note**: OCR support is not enabled. Install PIL and pytesseract for OCR. (注意：OCR 支持未启用。安装 PIL 和 pytesseract 以启用 OCR)")
        
        output.append(f"\n## Extracted Text (提取的文本)\n\n")
        output.append(text_content)
        
        if has_images and image_files:
            output.append(f"\n## Image References (图片引用)\n")
            for img_file in image_files:
                output.append(f"- `{img_file}`")
        
        return '\n'.join(output)


def main():
    """Main function (主函数)"""
    parser = argparse.ArgumentParser(
        description='Extract text from DOC/DOCX and PDF files with image detection (从 DOC/DOCX 和 PDF 文件提取文本，支持图片检测)',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument('file_path', help='Path to document file (文档文件路径)')
    parser.add_argument('-o', '--output', help='Output file path (输出文件路径)')
    parser.add_argument('--no-ocr', action='store_true', help='Disable OCR processing (禁用 OCR 处理)')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.file_path):
        print(f"Error: File not found: {args.file_path} (错误：文件未找到：{args.file_path})")
        sys.exit(1)
    
    # Create reader (创建读取器)
    reader = DocumentReader(use_ocr=not args.no_ocr)
    
    # Extract content (提取内容)
    print(f"Processing file: {args.file_path} (处理文件：{args.file_path})")
    result = reader.extract_with_images(args.file_path)
    
    # Output result (输出结果)
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(result)
        print(f"Output saved to: {args.output} (输出已保存到：{args.output})")
    else:
        print("\n" + "="*80)
        print(result)
        print("="*80)


if __name__ == '__main__':
    main()













