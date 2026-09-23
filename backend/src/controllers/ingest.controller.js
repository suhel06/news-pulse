const { spawn } = require("child_process");
const path = require("path");

const jobs = new Map();

const triggerIngest = (req, res) => {
  const jobId = Date.now().toString();

  const scraperPath = path.resolve(__dirname, "../../../scraper");
  const pythonScript = path.join(scraperPath, "main.py");

  // Use the Python inside our virtual environment
  const pythonExecutable = path.join(
    scraperPath,
    "venv",
    "Scripts",
    "python.exe"
  );

  console.log("Scraper path:", scraperPath);
  console.log("Python:", pythonExecutable);
  console.log("Script:", pythonScript);

  jobs.set(jobId, {
    status: "running",
    startedAt: new Date(),
  });

  const pythonProcess = spawn(
    pythonExecutable,
    [pythonScript],
    {
      cwd: scraperPath,
      env: {
        ...process.env,
        PYTHONPATH: scraperPath,
      },
    }
  );

  let output = "";
  let errorOutput = "";

  pythonProcess.stdout.on("data", (data) => {
    const text = data.toString();

    output += text;

    console.log("[Python]", text);
  });

  pythonProcess.stderr.on("data", (data) => {
    const text = data.toString();

    errorOutput += text;

    console.error("[Python Error]", text);
  });

  pythonProcess.on("error", (error) => {
    console.error("Failed to start Python:", error);

    jobs.set(jobId, {
      status: "failed",
      error: error.message,
    });
  });

  pythonProcess.on("close", (code) => {
    console.log("Python exited with code:", code);

    if (code === 0) {
      jobs.set(jobId, {
        status: "completed",
        startedAt: jobs.get(jobId)?.startedAt,
        completedAt: new Date(),
        output,
      });
    } else {
      jobs.set(jobId, {
        status: "failed",
        startedAt: jobs.get(jobId)?.startedAt,
        completedAt: new Date(),
        error:
          errorOutput ||
          `Python exited with code ${code}`,
      });
    }
  });

  res.status(202).json({
    success: true,
    jobId,
    status: "running",
    message: "Ingestion job started",
  });
};


const getIngestStatus = (req, res) => {
  const { jobId } = req.params;

  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  res.status(200).json({
    success: true,
    jobId,
    ...job,
  });
};


module.exports = {
  triggerIngest,
  getIngestStatus,
};