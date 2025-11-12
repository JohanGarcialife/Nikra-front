export function parseInvoiceData(text, comerciosList) {
  const cleanText = text.toUpperCase().replace(/\s+/g, " ");
  const lines = text.split("\n").map((line) => line.trim().toUpperCase());

  // 1. Extraer nombre del comercio (primeras 5 líneas) con matching inteligente
  let comercioId = "";
  const firstLines = lines.slice(0, 5).join(" ");

  console.log("=== DEBUG COMERCIO ===");
  console.log("Primeras líneas:", firstLines);
  console.log("Total comercios disponibles:", comerciosList.length);

  let bestMatch = null;
  let maxMatches = 0;

  for (const comercio of comerciosList) {
    const comercioName = comercio.name.toUpperCase();

    // Dividir en palabras (mínimo 3 caracteres)
    const comercioWords = comercioName.split(/\s+/).filter((w) => w.length > 3);

    // Contar cuántas palabras del comercio aparecen en las primeras líneas
    let matchCount = 0;
    const matchedWords = [];

    for (const word of comercioWords) {
      // Matching flexible: permitir palabras similares (sin números al final)
      const cleanWord = word.replace(/\d+$/, ""); // Quitar números al final

      if (
        firstLines.includes(word) ||
        (cleanWord.length > 3 && firstLines.includes(cleanWord))
      ) {
        matchCount++;
        matchedWords.push(word);
      }
    }

    console.log(
      `Comercio: ${
        comercio.name
      } | Palabras coincidentes: ${matchCount} | Palabras: [${matchedWords.join(
        ", "
      )}]`
    );

    // Si tiene 2 o más palabras coincidentes, es un buen candidato
    if (matchCount >= 2 && matchCount > maxMatches) {
      maxMatches = matchCount;
      bestMatch = comercio;
    }

    // Si coincide el nombre completo, tomar inmediatamente
    if (firstLines.includes(comercioName)) {
      console.log("✓ Match exacto encontrado:", comercio.name);
      comercioId = comercio.id;
      break;
    }
  }

  // Si no hubo match exacto pero hay un buen candidato (2+ palabras)
  if (!comercioId && bestMatch) {
    console.log(
      `✓ Comercio encontrado por coincidencia (${maxMatches} palabras):`,
      bestMatch.name
    );
    comercioId = bestMatch.id;
  }

  if (!comercioId) {
    console.log(
      "✗ No se encontró ningún comercio con suficientes coincidencias"
    );
  }

  // 2. Extraer número de ticket (FACT. SIMP, FACTURA SIMPLE/SIMPLIFICADA)
  let ticketNumber = "";

  console.log("=== DEBUG TICKET ===");

  // Patrones de búsqueda más específicos (case insensitive)
  const ticketKeywords = [
    /FACT\.?\s*SIMP/i,
    /FACTURA\s+SIMPLE/i,
    /FACTURA\s+SIMPLIFICADA/i,
    /FRA\.?\s*SIMP/i,
  ];

  // Buscar la línea que contenga alguno de estos patrones
  let fraLineIndex = -1;
  for (const pattern of ticketKeywords) {
    fraLineIndex = lines.findIndex((line) => pattern.test(line));
    if (fraLineIndex !== -1) {
      console.log(`Patrón encontrado: ${pattern} en línea ${fraLineIndex}`);
      break;
    }
  }

  if (fraLineIndex !== -1) {
    const fraLine = lines[fraLineIndex];
    console.log("Línea de factura:", fraLine);

    // Intentar extraer el código de la misma línea
    // Buscar después de los dos puntos o espacio
    const patterns = [
      /(?:FACT\.?\s*SIMP\.?|FACTURA\s+SIMPLE|FACTURA\s+SIMPLIFICADA)[:\s]+([A-Z0-9\/-]+)/i,
      /(?:FACT\.?\s*SIMP\.?|FACTURA\s+SIMPLE|FACTURA\s+SIMPLIFICADA)\s*:?\s*([A-Z0-9\/-]+)/i,
    ];

    for (const pattern of patterns) {
      const match = fraLine.match(pattern);
      if (match) {
        ticketNumber = match[1].trim();
        console.log("✓ Ticket encontrado en misma línea:", ticketNumber);
        break;
      }
    }

    // Si no está en la misma línea, buscar en la siguiente
    if (!ticketNumber && fraLineIndex + 1 < lines.length) {
      const nextLine = lines[fraLineIndex + 1];
      console.log("Buscando en siguiente línea:", nextLine);

      // Ignorar líneas que claramente no son el número de ticket
      const excludeKeywords = [
        "FECHA",
        "HORA",
        "DIVISA",
        "OPERARIO",
        "ARTICULO",
        "TOTAL",
      ];
      const shouldSkip = excludeKeywords.some((keyword) =>
        nextLine.includes(keyword)
      );

      if (!shouldSkip) {
        // Extraer el primer grupo alfanumérico de la línea
        const nextLineMatch = nextLine.match(/^([A-Z0-9\/-]+)/i);
        if (nextLineMatch) {
          ticketNumber = nextLineMatch[1].trim();
          console.log("✓ Ticket encontrado en línea siguiente:", ticketNumber);
        }
      } else {
        console.log(
          "Línea siguiente descartada (contiene palabra clave excluida)"
        );
      }
    }

    // Si aún no se encuentra, intentar buscar en la línea anterior (por si OCR invirtió orden)
    if (!ticketNumber && fraLineIndex > 0) {
      const prevLine = lines[fraLineIndex - 1];
      console.log("Buscando en línea anterior:", prevLine);

      const prevLineMatch = prevLine.match(/([A-Z0-9\/-]+)$/i);
      if (prevLineMatch) {
        ticketNumber = prevLineMatch[1].trim();
        console.log("✓ Ticket encontrado en línea anterior:", ticketNumber);
      }
    }
  } else {
    console.log("No se encontró patrón de FACTURA SIMPLE/SIMPLIFICADA");
  }

  // Fallback a patrones genéricos si no se encontró
  if (!ticketNumber) {
    console.log("Intentando patrones genéricos...");
    const genericPatterns = [
      /(?:N[°º]?\s*FACTURA|NUM\.?\s*FACTURA)[:\s]*([A-Z0-9\/-]+)/i,
      /(?:TICKET|TKT)[:\s]*([A-Z0-9\/-]+)/i,
    ];

    for (const pattern of genericPatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        ticketNumber = match[1].trim();
        console.log("✓ Ticket encontrado con patrón genérico:", ticketNumber);
        break;
      }
    }
  }

  if (!ticketNumber) {
    console.log("✗ No se pudo extraer número de ticket");
  }

  // 3. Extraer fecha (DD/MM/YYYY, DD-MM-YYYY, incluso años incompletos)
  let ticketDate = "";

  // Buscar la línea que contenga FECHA
  const fechaLine = lines.find((line) => line.includes("FECHA"));

  if (fechaLine) {
    // Intentar varios formatos de fecha
    const datePatterns = [
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, // DD/MM/YYYY completo
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/, // DD/MM/YY
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{1})/, // DD/MM/Y (año incompleto por OCR)
    ];

    for (const pattern of datePatterns) {
      const dateMatch = fechaLine.match(pattern);
      if (dateMatch) {
        const [, day, month, year] = dateMatch;
        let fullYear = year;

        // Si el año tiene menos de 4 dígitos, completarlo
        if (year.length === 1) {
          // Si es un solo dígito, asumir 202X
          fullYear = `202${year}`;
        } else if (year.length === 2) {
          fullYear = `20${year}`;
        }

        ticketDate = `${fullYear}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}`;
        break;
      }
    }
  }

  // Fallback: buscar en todo el texto
  if (!ticketDate) {
    const dateMatch = cleanText.match(
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/
    );
    if (dateMatch) {
      const [, day, month, year] = dateMatch;
      const fullYear = year.length === 2 ? `20${year}` : year;
      ticketDate = `${fullYear}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
    }
  }

  // 4. Extraer importe total (solo TOTAL, no TOTAL ARTÍCULOS)
  let totalAmount = "";

  // Buscar líneas que contengan "TOTAL" pero NO "ARTÍCULOS" ni "ARTÍCULO"
  const totalLines = lines.filter(
    (line) =>
      line.includes("TOTAL") &&
      !line.includes("ARTICULO") &&
      !line.includes("ARTÍCULO") &&
      !line.includes("ARTICULOS") &&
      !line.includes("ARTÍCULOS")
  );

  console.log("=== DEBUG TOTAL ===");
  console.log("Líneas con TOTAL (excluyendo ARTÍCULOS):", totalLines);

  if (totalLines.length > 0) {
    // Tomar la última línea que contenga TOTAL (generalmente es el total final)
    const totalLine = totalLines[totalLines.length - 1];
    console.log("Línea de TOTAL seleccionada:", totalLine);

    // Extraer todos los números de esa línea que parezcan montos
    const amountMatches = totalLine.match(/(\d+[.,]\d{1,2}|\d+)/g);
    console.log("Números encontrados en la línea:", amountMatches);

    if (amountMatches && amountMatches.length > 0) {
      // Tomar el último número (generalmente es el total)
      let amount = amountMatches[amountMatches.length - 1].replace(",", ".");

      // Asegurar formato con 2 decimales
      if (!amount.includes(".")) {
        amount = amount + ".00";
      } else if (amount.split(".")[1].length === 1) {
        amount = amount + "0";
      }

      console.log("Monto extraído:", amount);
      totalAmount = amount;
    }
  }

  // Si no se encontró con el método anterior, probar con patrones
  if (!totalAmount) {
    console.log("Intentando patrones de fallback para TOTAL...");

    // Patrones que excluyen específicamente TOTAL ARTÍCULOS
    const amountPatterns = [
      /(?<!ARTICULO\s)(?<!ARTÍCULO\s)(?<!ARTICULOS\s)(?<!ARTÍCULOS\s)TOTAL[:\s]*€?\s*(\d+[.,]\d{1,2})/i,
      /IMPORTE\s+TOTAL[:\s]*€?\s*(\d+[.,]\d{1,2})/i,
    ];

    for (const pattern of amountPatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        let amount = match[1].replace(",", ".");
        if (!amount.includes(".")) {
          amount = amount + ".00";
        } else if (amount.split(".")[1].length === 1) {
          amount = amount + "0";
        }
        console.log("✓ Total encontrado con patrón fallback:", amount);
        totalAmount = amount;
        break;
      }
    }
  }

  if (!totalAmount) {
    console.log("✗ No se pudo extraer el total");
  }

  return { comercioId, ticketNumber, ticketDate, totalAmount };
}
